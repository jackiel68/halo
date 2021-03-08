class CompanyFocusType < ActiveRecord::Base
  belongs_to :company
end

# == Schema Information
#
# Table name: company_focus_types
#
#  id         :integer          not null, primary key
#  focus_type :string
#  company_id :integer
#
# Indexes
#
#  index_company_focus_types_on_company_id  (company_id)
#
