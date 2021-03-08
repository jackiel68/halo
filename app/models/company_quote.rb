class CompanyQuote < ActiveRecord::Base
  belongs_to :company
end

# == Schema Information
#
# Table name: company_quotes
#
#  id            :integer          not null, primary key
#  employee_name :string
#  role          :string
#  quote         :text
#  image_url     :string
#  company_id    :integer
#
# Indexes
#
#  index_company_quotes_on_company_id  (company_id)
#
