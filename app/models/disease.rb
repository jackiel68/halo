class Disease < ActiveRecord::Base
  # Concerns
  extend FriendlyId
  friendly_id :name
  has_paper_trail
  acts_as_list
  mount_uploader :image, FeaturedImageUploader
  mount_uploader :cover, CoverImageUploader

  # Relationships
  has_many :foundations, dependent: :destroy
  has_many :campaigns, dependent: :destroy
  has_many :donations, through: :campaigns
  has_and_belongs_to_many :users

  # Validations
  validates :name, presence: true
  validates :description, presence: true
  validates :image, presence: true
  validates :cover, presence: true, if: :feature_on_homepage

  # Scopes
  scope :alphabetized, -> { order(name: :asc) }
  scope :featured_on_homepage, -> { where(feature_on_homepage: true).order(position: :desc) }
end

# == Schema Information
#
# Table name: diseases
#
#  id                  :integer          not null, primary key
#  name                :string           default(""), not null
#  description         :text             default(""), not null
#  stats               :text             default(""), not null
#  created_at          :datetime
#  updated_at          :datetime
#  slug                :string
#  intro               :text             default(""), not null
#  image               :text             default(""), not null
#  cover               :string
#  feature_on_homepage :boolean          default(FALSE), not null
#  position            :integer
#
