class DiseaseCategory < ActiveRecord::Base
  # Concerns
  extend FriendlyId
  friendly_id :name
  has_paper_trail
  acts_as_list
  mount_uploader :image, FeaturedImageUploader

  # Relationships
  has_and_belongs_to_many :diseases
  has_many :campaigns, through: :diseases

  # Validations
  validates :name, presence: true
  validates :description, presence: true
  validates :image, presence: true

  # Scopes
  scope :featured_on_homepage, -> { where(feature_on_homepage: true).order(position: :asc) }
end

# == Schema Information
#
# Table name: disease_categories
#
#  id                  :integer          not null, primary key
#  name                :string           default(""), not null
#  description         :text             default(""), not null
#  image               :string
#  slug                :string
#  feature_on_homepage :boolean          default(FALSE), not null
#  position            :integer
#  created_at          :datetime
#  updated_at          :datetime
#
