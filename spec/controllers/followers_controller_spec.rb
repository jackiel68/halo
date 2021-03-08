# == Schema Information
#
# Table name: followers
#
#  id          :integer          not null, primary key
#  campaign_id :integer
#  email       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_followers_on_campaign_id  (campaign_id)
#  index_followers_on_email        (email) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

require 'rails_helper'

RSpec.describe FollowersController, type: :controller do

end
