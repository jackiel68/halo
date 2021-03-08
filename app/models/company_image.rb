class CompanyImage < ActiveRecord::Base
  belongs_to :company
end

# == Schema Information
#
# Table name: company_images
#
#  id         :integer          not null, primary key
#  image_url  :string
#  company_id :integer
#
# Indexes
#
#  index_company_images_on_company_id  (company_id)
#
