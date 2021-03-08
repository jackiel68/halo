class CompanyPartner < ActiveRecord::Base
  belongs_to :company
end

# == Schema Information
#
# Table name: company_partners
#
#  id               :integer          not null, primary key
#  institution_name :string
#  partner_name     :string
#  research_area    :string
#  description      :text
#  company_id       :integer
#
# Indexes
#
#  index_company_partners_on_company_id  (company_id)
#
