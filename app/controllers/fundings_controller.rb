class FundingsController < ApplicationController
  layout "clean", :only => [:index]

  before_filter :require_user!, :only => [:create]

  def create
    begin
      Funding.transaction do
        funding = Funding.new
        funding.user_id = current_user.id
        funding.title = params[:funding]['fundingTitle']
        funding.description = params[:funding]['fundingDescription']
        funding.amount = params[:funding]['fundingAmount']
        funding.award_recipient_id = current_user.id if params[:funding]['isAwardRecipient'] == 'true'
        funding.date = DateTime.parse(params[:funding]['fundingDate']) if params[:funding]['fundingDate']
        funding.end_date = DateTime.parse(params[:funding]['fundingEndDate']) if params[:funding]['fundingEndDate']
        funding.sponsor_type = params[:funding]['fundingSourceType']
        funding.sponsor_id = params[:funding]['fundingSponsor'] if params[:funding]['fundingSponsor'] && !params[:funding]['hasOtherSponsor']
        funding.other_sponsor = params[:funding]['fundingSponsor'] if params[:funding]['hasOtherSponsor']
        funding.url = params[:funding]['fundingURL'] if params[:funding]['fundingURL']
        funding.grant_type = params[:funding]['fundingGrantType'] if params[:funding]['fundingGrantType']
        funding.save!

        return render :json => { :success => true, :funding => funding }
      end
    rescue => e
      return render :json => { :success => false, error: e.message }
    end
  end

  def update
    funding = Funding.find(params[:id])

    if !current_user || current_user.id.to_i != funding.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      Funding.transaction do
        funding.title = params[:funding]['fundingTitle']
        funding.description = params[:funding]['fundingDescription']
        funding.amount = params[:funding]['fundingAmount']
        funding.award_recipient_id = params[:funding]['isAwardRecipient'] == 'true' ? current_user.id : nil
        funding.date = DateTime.parse(params[:funding]['fundingDate']) if params[:funding]['fundingDate']
        funding.end_date = params[:funding]['fundingEndDate'] ? DateTime.parse(params[:funding]['fundingEndDate']) : nil
        funding.sponsor_type = params[:funding]['fundingSourceType']
        funding.sponsor_id = params[:funding]['fundingSponsor'] if params[:funding]['fundingSponsor'] && !params[:funding]['hasOtherSponsor']
        funding.other_sponsor = params[:funding]['hasOtherSponsor'] ? params[:funding]['fundingSponsor'] : nil
        funding.url = params[:funding]['fundingURL'] if params[:funding]['fundingURL']
        funding.grant_type = params[:funding]['fundingGrantType'] if params[:funding]['fundingGrantType']
        funding.save!

        return render :json => { :success => true, :funding => funding }
      end
    rescue => e
      return render :json => { :success => false, error: e.message }
    end
  end

  def index
    @fundings = Funding.where(:user_id => params[:user_id]).order(:id)
    render :json => { :fundings => @fundings }
  end

  def destroy
    funding = Funding.find(params[:id])

    if !current_user || current_user.id.to_i != funding.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    funding.destroy

    render :json => { :success => true }
  end
end
