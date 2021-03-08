class CampaignNote < ActiveRecord::Base
  # Relationships
  belongs_to :campaign
  belongs_to :advisor, class_name: CampaignAdvisor

  # Validations
  validates :title, presence: true
  validates :description, presence: true
  validates :campaign, presence: true
  validates :advisor, presence: true
end

# == Schema Information
#
# Table name: campaign_notes
#
#  id          :integer          not null, primary key
#  advisor_id  :integer          not null
#  campaign_id :integer          not null
#  title       :string           default(""), not null
#  description :text             default(""), not null
#  created_at  :datetime
#  updated_at  :datetime
#
