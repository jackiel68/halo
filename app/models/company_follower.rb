class CompanyFollower < ActiveRecord::Base
  belongs_to :company
  belongs_to :user
end

# == Schema Information
#
# Table name: company_followers
#
#  id         :integer          not null, primary key
#  company_id :integer
#  user_id    :integer
#
# Indexes
#
#  index_company_followers_on_company_id  (company_id)
#  index_company_followers_on_user_id     (user_id)
#
