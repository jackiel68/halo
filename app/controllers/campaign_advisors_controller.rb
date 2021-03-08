class CampaignAdvisorsController < ApplicationController
  def index
    @campaign_advisors = Campaign.upcoming
  end
end
