class UserFollow < ActiveRecord::Base

end

# == Schema Information
#
# Table name: user_follows
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  company_id :integer
#  user_id    :integer
#
# Indexes
#
#  index_user_follows_on_company_id  (company_id)
#  index_user_follows_on_user_id     (user_id)
#
