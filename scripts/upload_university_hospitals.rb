require 'csv'

CSV.foreach("#{Rails.root}/data/university_hospitals.csv") do |row|
  institutions = row[0].split(' - ')
  if institutions.length > 1
    University.where(:name => row[0]).destroy_all
  end

  institutions.each_with_index do |institution, i|
    if i > 0 && institution.split.length > 1
      university = University.find_or_create_by(:name => institution)
      puts university.name
    elsif i > 0 && institution.split.length == 1
      University.where(:name => institution).destroy_all
    end
  end
end
