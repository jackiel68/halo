class UserKeyword < ActiveRecord::Base
  belongs_to :user
  belongs_to :research_keyword
end

# == Schema Information
#
# Table name: user_keywords
#
#  id                  :integer          not null, primary key
#  user_id             :integer
#  created_at          :datetime
#  updated_at          :datetime
#  research_keyword_id :integer
#
# Indexes
#
#  index_user_keywords_on_research_keyword_id  (research_keyword_id)
#  index_user_keywords_on_user_id              (user_id)
#
