require 'csv'

CSV.foreach("#{Rails.root}/data/descriptors.csv") do |row|
  puts row[0]
  research_keyword = ResearchKeyword.find_or_create_by(:research_type => row[0])
end
