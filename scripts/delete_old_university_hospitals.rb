require 'csv'

CSV.foreach("#{Rails.root}/data/university_hospitals.csv") do |row|
  University.where(:name => row[0]).destroy_all
end
