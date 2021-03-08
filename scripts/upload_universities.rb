require 'csv'

CSV.foreach("#{Rails.root}/data/universities.csv") do |row|
  puts row[0]
  university = University.find_or_create_by(:name => row[0])
end
