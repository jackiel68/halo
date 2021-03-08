class Follower < ActiveRecord::Base
  belongs_to :campaign

  delegate :name, :slug, to: :campaign, prefix: true

  validates :campaign, :email, presence: true
  validates :email, uniqueness: true
end

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
