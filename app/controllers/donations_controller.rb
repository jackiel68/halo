class DonationsController < ApplicationController
  before_action :require_sign_in, only: [:index, :new]
  before_action :authenticate_user!, only: [:create, :redonate, :refund]
  before_action :set_campaign, only: [:new, :create, :thank_you]
  before_action :set_donation, only: [:thank_you, :redonate, :refund]

  def index
    if current_user
      @campaigns = current_user.campaigns.includes(:disease).uniq
      @undistributed_donations = current_user.donations.undistributed
    end
  end

  def new    
    if current_user.nil?
      Analytics.track(
        anonymous_id: SecureRandom.uuid,
        event: "Account Signup Popup",
      )
    end
    @donation = @campaign.donations.build
    @donation.amount = nil
  end

  def create
    @donation = @campaign.donations.build(resource_params)
    
    if @donation.save_with_payment!
      track_donation
      redirect_to(thank_you_campaign_donation_path(@campaign, @donation))
    else
      # render :new
      flash[:error] = 'There was a problem processing your donation.'
      redirect_to(new_campaign_donation_path)
    end
  end

  def redonate
    if @donation.redonate_to!(Campaign.current)
      flash[:success] = 'Redonated successfully'
    else
      flash[:error] = @donation.errors.full_messages.to_sentence
    end

    redirect_to(donations_path)
  end

  def refund
    if @donation.refund!
      track_refund
      flash[:success] = 'Donation refunded successfully'
    else
      flash[:error] = 'There was a problem processing your refund.'
    end

    redirect_to(donations_path)
  end

  private

  def set_campaign
    @campaign = Campaign.open.friendly.find(params[:campaign_id])
  end

  def set_donation
    @donation = current_user.donations.find(params[:id])
  end

  def resource_params
    params[:donation] = params.require(:donation).permit(
      :amount,
      :is_anonymous,
      :loved_one_name,
      :stripe_card_token
    ).merge(
      user_id: current_user.id,
      referrer_id: referrer_id
    )
  end

  def referrer_id
    return unless session[:referrers]
    referrer = session[:referrers].detect {|r| r['campaign_id'] == @campaign.id }
    return unless referrer
    referrer_token = referrer['referrer_token']
    return if current_user.referrer_token == referrer_token
    User.find_by(referrer_token: referrer_token).id
  end

  def track_donation
    Analytics.track(
      user_id: current_user.id,
      event: 'Donated',
      properties: {
        amount: pretty_amount(@donation.amount),
        loved_one_name: @donation.loved_one_name
      }.merge(@campaign.trackable_properties)
    )
  end

  def track_refund
    Analytics.track(
      user_id: current_user.id,
      event: 'Requested a refund',
      properties: {
        amount: pretty_amount(@donation.amount),
        campaign_name: @donation.campaign.name
      }
    )
  end

  def pretty_amount(amount)
    amount.round == amount ? amount.to_i : amount
  end
end
