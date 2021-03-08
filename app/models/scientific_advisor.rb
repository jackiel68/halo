class ScientificAdvisor < ActiveRecord::Base
  # Constants
  #SECTORS = %w[academia industry nonprofit]

  # Concerns
  has_paper_trail
  mount_uploader :image, AvatarUploader

  # Relationships
  # has_many :campaign_notes, dependent: :destroy, foreign_key: :advisor_id
  # belongs_to :campaign

  # Validations
  validates :full_name, presence: true
  validates :title, presence: true
  validates :institution, presence: true
  validates :linkedin_profile, presence: true
  validates :image, presence: true

  # Instance methods
  # def sector_enum
  #   SECTORS
  # end
end

# == Schema Information
#
# Table name: scientific_advisors
#
#  id               :integer          not null, primary key
#  full_name        :string
#  title            :string
#  institution      :string
#  linkedin_profile :string
#  image            :string           default(""), not null
#
