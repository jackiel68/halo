class GovernmentOrganization < ActiveRecord::Base
  validates_uniqueness_of :org_name

end

# == Schema Information
#
# Table name: government_organizations
#
#  id          :integer          not null, primary key
#  org_name    :string
#  description :text
#
# Indexes
#
#  index_government_organizations_on_org_name  (org_name)
#
