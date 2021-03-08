class UserProfileInfo < ActiveRecord::Base
  AREA_OF_EXPERTISE = {
    :allergies => "Allergies",
    :cardiovascular => "Cardiovascular",
    :dermatology => "Dermatology",
    :epidemiology => "Epidemiology",
    :endocrinology => "Endocrinology",
    :genomics => "Genomics",
    :hematology => "Hematology",
    :immunology => "Immunology",
    :infectious_diseases => "Infectious Diseases",
    :metabolic => "Metabolic",
    :neprhology => "Nephrology",
    :neuroscience => "Neuroscience",
    :oncology => "Oncology",
    :ophthalmology => "Ophthalmology",
    :pulmonary => "Pulmonary",
    :regenerative_medicine => "Regenerative Medicine",
    :water => "Water",
    :other_specialty => "Other Research Area",
  }.freeze

  TITLE = {
    :principal_investigator => "Principal Investigator",
    :postdoctoral_researcher => "Postdoctoral Scientist",
    :phd => "PhD Candidate",
    :research_associate => "Research Associate",
    :startup_founder => "Startup Founder",
  }.freeze

  UNIVERSITY_TITLE = {
    :corporate_relations => "Corporate Relations",
    :tech_transfer => "Tech Transfer",
    :research_development => "Research Development",
    :department_head => "Department Head",
  }.freeze

  HUBSPOT_TITLE_CONVERSION = {
    :principal_investigator => "Principal Investigator",
    :postdoctoral_researcher => "Postdoc",
    :phd => "Phd Student",
    :research_associate => "Research Associate",
    :startup_founder => "Startup Founder",
    :corporate_relations => "Corporate Relations",
    :tech_transfer => "Tech Transfer",
    :research_development => "Research Development",
    :department_head => "Department Head",
  }.freeze

  belongs_to :user

  def as_json(options={})
    h = super(options)
    h['title'] = TITLE[title.try(:to_sym)] || UNIVERSITY_TITLE[title.try(:to_sym)] || ''

    areas_of_expertise = area_of_expertise.split(/,(?!\s)/) if area_of_expertise
    if area_of_expertise && areas_of_expertise.length > 1
      h['area_of_expertise'] = areas_of_expertise.map { |expertise| AREA_OF_EXPERTISE[expertise.try(:to_sym)] || expertise }.join(',')
    else
      h['area_of_expertise'] = AREA_OF_EXPERTISE[area_of_expertise.try(:to_sym)] || area_of_expertise
    end
    h
  end
end

# == Schema Information
#
# Table name: user_profile_infos
#
#  id                  :integer          not null, primary key
#  title               :string
#  location            :string
#  area_of_expertise   :string
#  user_id             :integer
#  created_at          :datetime
#  updated_at          :datetime
#  about               :text
#  location_details    :string
#  location_start_year :string
#  location_end_year   :string
#  headline            :string
#
# Indexes
#
#  index_user_profile_infos_on_user_id  (user_id)
#
