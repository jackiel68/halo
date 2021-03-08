require 'csv'

CSV.foreach("#{Rails.root}/data/health.csv", { :headers => :first_row, :col_sep => ";" }) do |row|
  if row && row[2]
    University.find_or_create_by(:name => row[2].gsub("*", "").strip)
  end
end

CSV.foreach("#{Rails.root}/data/higher_education.csv", { :headers => :first_row, :col_sep => ";" }) do |row|
  if row && row[2]
    University.find_or_create_by(:name => row[2].gsub("*", "").strip)
  end
end
