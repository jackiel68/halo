class EmailResponseTemplate < ActiveRecord::Base
  belongs_to :user
end

# == Schema Information
#
# Table name: email_response_templates
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#  content    :text
#  title      :string
#
