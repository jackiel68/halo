class Publication < ActiveRecord::Base
  has_many :proposals, through: :proposals_publications
  has_many :proposals_publications, :dependent => :delete_all, :autosave => true

  validates :title, presence: true
  validates :publication_name, presence: true
  validates :abstract, presence: true
end

# == Schema Information
#
# Table name: publications
#
#  id               :integer          not null, primary key
#  created_at       :datetime
#  updated_at       :datetime
#  user_id          :integer
#  title            :string
#  abstract         :text
#  publication_name :string
#  date             :datetime
#  url              :string
#
# Indexes
#
#  index_publications_on_user_id  (user_id)
#
