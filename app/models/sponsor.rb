class Sponsor < Organization
  # Relationships
  has_many :campaigns, dependent: :destroy
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
