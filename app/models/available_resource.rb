class AvailableResource < ActiveRecord::Base
  RESOURCE_TYPES = {
    :funding => "Funding",
    :compounds_reagents => "Compounds",
    :tools_technologies => "Technologies",
    :mentorship_expertise => "Expertise",
    :lab_space => "Facilities",
  }.freeze

  belongs_to :request_for_proposal

  def title
    self.resource_type
  end
end

# == Schema Information
#
# Table name: available_resources
#
#  id                      :integer          not null, primary key
#  created_at              :datetime
#  updated_at              :datetime
#  request_for_proposal_id :integer
#  resource_type           :string
#  description             :text
#
# Indexes
#
#  index_available_resources_on_request_for_proposal_id  (request_for_proposal_id)
#  index_available_resources_on_resource_type            (resource_type)
#
