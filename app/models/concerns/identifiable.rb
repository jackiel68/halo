module Identifiable
  extend ActiveSupport::Concern

  def identify_user
    if !Rails.env.development? && !Rails.env.test?
      Analytics.identify(
        user_id: id,
        traits: {
          name: name,
          first_name: first_name,
          last_name: last_name,
          email: email,
          interests: interests,
          donations: donations.count,
          available_funds: available_funds,
          created_at: created_at
        },
      )
    end
  end
end

