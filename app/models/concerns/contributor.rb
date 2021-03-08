module Contributor
  extend ActiveSupport::Concern

  included do
    def direct_donations_for(campaign)
      campaign.donations.where(user_id: id).sum(:amount)
    end

    def indirect_donations_for(campaign)
      indirect_donations(campaign).sum(:amount)
    end

    def total_donations_for(campaign)
      direct_donations_for(campaign) + indirect_donations_for(campaign)
    end

    def shares_for(campaign)
      indirect_donations(campaign).count
    end

    def available_funds
      donations.undistributed.sum(:amount)
    end

    private

    def indirect_donations(campaign)
      @indirect_donations ||= campaign.donations.where(referrer_id: id)
    end
  end
end
