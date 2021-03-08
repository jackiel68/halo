class Foundation < ActiveRecord::Base
  validates_uniqueness_of :foundation_name

end

# == Schema Information
#
# Table name: foundations
#
#  id              :integer          not null, primary key
#  foundation_name :string
#  description     :text
#
# Indexes
#
#  index_foundations_on_foundation_name  (foundation_name)
#
