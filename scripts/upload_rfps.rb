require 'csv'

CSV.foreach("#{Rails.root}/data/non_partner_rfps.csv") do |row|
  next if row[0].blank? || row[0] == "Company"
  company_name = row[0]
  therapeutic_area = row[1].underscore.strip
  innovation_types = row[2].split(',').map { |it| it.split(' ').join('_').underscore.strip }
  title = row[3]
  summary = row[4]
  why_it_matters = row[5]
  in_scope_proposals = row[6].present? ? row[6] : nil
  out_of_scope_proposals = row[7].present? ? row[7] : nil

  available_resources = []
  available_resources << "funding" if row[8] && row[8].include?("X")
  available_resources << "compounds_reagents" if row[9] && row[9].include?("X")
  available_resources << "tools_technologies" if row[10] && row[10].include?("X")
  available_resources << "mentorship_expertise" if row[11] && row[11].include?("X")
  available_resources << "lab_space" if row[12] && row[12].include?("X")
  available_resources << row[14] if row[14].present?
  additional_resource_details = row[15].present? ? row[15] : nil
  deadline = row[16].present? ? DateTime.parse(row[16]) : nil

  user = User.find_by_email("justinkchen14@gmail.com")
  company = Company.find_by_company_name(company_name) || Company.create(:company_name => company_name, :identifier => Company.generate_identifier(company_name))

  RequestForProposal.transaction do
    rfp = RequestForProposal.create({
      :user_id => user.id,
      :company_id => company.id,
      :title => title,
      :summary => summary,
      :therapeutic_area => therapeutic_area,
      :why_it_matters => why_it_matters,
      :in_scope_proposals => in_scope_proposals,
      :out_of_scope_proposals => out_of_scope_proposals,
      :additional_resource_details => additional_resource_details,
      :identifier => RequestForProposal.generate_identifier(title),
      :deadline => deadline
    })

    puts rfp.inspect
    puts available_resources
    puts innovation_types

    if rfp.errors.blank?
      available_resources.each do |resource|
        AvailableResource.create({
          :request_for_proposal => rfp,
          :resource_type => resource,
        })
      end

      innovation_types.each do |innovation_type|
        InnovationType.create({
          :request_for_proposal => rfp,
          :value => innovation_type,
        })
      end
    end
  end
end
