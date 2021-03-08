class Organization < ActiveRecord::Base
  # Concerns
  has_paper_trail
  mount_uploader :logo, LogoUploader

  # Relationships
  belongs_to :disease

  # Validations
  validates :name, presence: true
  validates :url, presence: true, url: true
  validates :logo, presence: true

  # Scopes
  scope :universities, -> { where(is_university: true).order(name: :asc) }
end

# == Schema Information
#
# Table name: organizations
#
#  id            :integer          not null, primary key
#  name          :string           default(""), not null
#  url           :string           default(""), not null
#  disease_id    :integer
#  created_at    :datetime
#  updated_at    :datetime
#  logo          :string           default(""), not null
#  type          :string
#  is_university :boolean          default(FALSE), not null
#  tagline       :string           default(""), not null
#
