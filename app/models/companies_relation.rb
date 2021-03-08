class CompaniesRelation < ActiveRecord::Base
  def self.company_for_user(user)
    company_id = self.where(:user_id => user.id).last.try(:company_id)
    Company.find(company_id) if company_id
  end
end

# == Schema Information
#
# Table name: companies_relations
#
#  id         :integer          not null, primary key
#  company_id :integer
#  user_id    :integer
#  verified   :boolean
#
# Indexes
#
#  index_companies_relations_on_company_id  (company_id)
#  index_companies_relations_on_user_id     (user_id)
#
