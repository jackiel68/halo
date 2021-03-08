class Education < ActiveRecord::Base
  belongs_to :user
end

# == Schema Information
#
# Table name: educations
#
#  id             :integer          not null, primary key
#  created_at     :datetime
#  updated_at     :datetime
#  user_id        :integer
#  location       :string
#  degree         :string
#  start_year     :string
#  end_year       :string
#  field_of_study :string
#
# Indexes
#
#  index_educations_on_user_id  (user_id)
#
