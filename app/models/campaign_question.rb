class CampaignQuestion < ActiveRecord::Base
  # Relationships
  belongs_to :campaign

  # Concerns
  acts_as_list scope: :campaign
  has_paper_trail

  # Validations
  validates :question, presence: true
  validates :answer, presence: true
  validates :campaign, presence: true

  scope :sorted, -> { order(position: :asc) }
end

# == Schema Information
#
# Table name: campaign_questions
#
#  id          :integer          not null, primary key
#  question    :text             default(""), not null
#  answer      :text             default(""), not null
#  position    :integer          not null
#  campaign_id :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#
