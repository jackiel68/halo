class Identity < ActiveRecord::Base
  # Concerns
  has_paper_trail

  # Relationships
  belongs_to :user

  # Class methods
  def self.from_omniauth(auth)
    find_by(provider: auth[:provider], uid: auth[:uid]) || create_with_omniauth(auth)
  end

  private

  def self.create_with_omniauth(auth)
    create! do |identity|
      identity.provider = auth[:provider]
      identity.uid = auth[:uid]
      identity.name = auth[:info][:name]
      identity.email = auth[:info][:email]
      identity.image = auth[:info][:image]
    end
  end
end

# == Schema Information
#
# Table name: identities
#
#  id         :integer          not null, primary key
#  uid        :string           not null
#  provider   :string           not null
#  name       :string           default(""), not null
#  email      :string           default(""), not null
#  image      :string           default(""), not null
#  user_id    :integer
#  created_at :datetime
#  updated_at :datetime
#
# Indexes
#
#  index_identities_on_user_id  (user_id)
#
