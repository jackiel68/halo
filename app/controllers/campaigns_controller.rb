class CampaignsController < ApplicationController
  # skip_before_action :http_basic_authenticate, only: [:show]
  def index
    @upcoming_campaigns = Campaign.upcoming
  end

  def show
    @campaign = Campaign.friendly.find(params[:id])
    @upcoming_campaigns = Campaign.upcoming
    set_referrer
  end

  private

  def set_referrer
    return unless params[:referrer]

    session[:referrers] ||= []
    session[:referrers] << {
      campaign_id: @campaign.id,
      referrer_token: params[:referrer]
    }
    session[:referrers].uniq!
  end
end
