require 'csv'

OVERRIDE_NAME = {
  "Elanco Animal Health" => "Elanco",
}

def generate_identifier(company_name)
  company_name.downcase.split(' ').join('-').gsub(/[^0-9a-z\-]/i, '')
end

CSV.foreach("#{Rails.root}/data/sponsors_health.csv", { :headers => true }) do |row|
  company_name = row[0].strip
  identifier = generate_identifier(OVERRIDE_NAME[company_name] || company_name)
  puts identifier
  company = Company.find_or_create_by(:company_name => OVERRIDE_NAME[company_name] || company_name)
  company.identifier = identifier
  company.save
end
