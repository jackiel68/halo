class Company < ActiveRecord::Base
  include PgSearch

  pg_search_scope :search_for, against: %i(company_name), using: { tsearch: { normalization: 2, prefix: true, dictionary: "english", any_word: true } }

  validates_uniqueness_of :company_name

  def self.generate_identifier(company_name)
    company_name.downcase.split(' ').join('-').gsub(/[^0-9a-z\-]/i, '')
  end

  def title
    self.company_name
  end

  def as_json(options = { })
    h = super(options)
    h["company_images"] = CompanyImage.where(:company_id => id)
    h["company_reviewers"] = CompanyReviewer.where(:company_id => id)
    h["company_quotes"] = CompanyQuote.where(:company_id => id)
    h["company_partners"] = CompanyPartner.where(:company_id => id)
    h["company_focuses"] = CompanyFocusType.where(:company_id => id)
    h
  end
end

# == Schema Information
#
# Table name: companies
#
#  id                :integer          not null, primary key
#  company_name      :string
#  description       :text
#  is_partner        :boolean          default(FALSE), not null
#  identifier        :string
#  url               :string
#  logo_url          :string
#  company_image_url :string
#  hero_image_url    :string
#  location          :string
#  employee_count    :string
#  sales_amount      :string
#  funding_amount    :string
#
# Indexes
#
#  index_companies_on_company_name  (company_name)
#  index_companies_on_identifier    (identifier)
#
