class Startup < ActiveRecord::Base
  belongs_to :user

  validates :startup_name, presence: true
end

# == Schema Information
#
# Table name: startups
#
#  id           :integer          not null, primary key
#  created_at   :datetime
#  updated_at   :datetime
#  user_id      :integer
#  startup_name :string
#  url          :string
#  start_year   :string
#  end_year     :string
#
# Indexes
#
#  index_startups_on_user_id  (user_id)
#
