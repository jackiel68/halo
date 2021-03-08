class CampaignAdvisor < ActiveRecord::Base
  # Constants
  SECTORS = %w[academia industry nonprofit]

  # Concerns
  has_paper_trail
  mount_uploader :image, AvatarUploader

  # Relationships
  has_many :campaign_notes, dependent: :destroy, foreign_key: :advisor_id
  belongs_to :campaign

  # Validations
  validates :name, presence: true
  validates :title, presence: true
  validates :sector, presence: true, inclusion: { in: SECTORS }
  validates :quote, presence: true
  validates :campaign, presence: true
  validates :image, presence: true

  # Instance methods
  def sector_enum
    SECTORS
  end
end

# == Schema Information
#
# Table name: campaign_advisors
#
#  id          :integer          not null, primary key
#  name        :string           default(""), not null
#  title       :string           default(""), not null
#  sector      :string           default(""), not null
#  quote       :string           default(""), not null
#  image       :string           default(""), not null
#  campaign_id :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#
