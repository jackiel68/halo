class CompanyReviewer < ActiveRecord::Base
  belongs_to :company
end

# == Schema Information
#
# Table name: company_reviewers
#
#  id            :integer          not null, primary key
#  reviewer_name :string
#  position      :string
#  image_url     :string
#  introduction  :text
#  company_id    :integer
#
# Indexes
#
#  index_company_reviewers_on_company_id  (company_id)
#
