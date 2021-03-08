class InnovationType < ActiveRecord::Base
  belongs_to :request_for_proposal

  INNOVATION_TYPES = {
    :animal_models => "Animal models",
    :assays => "Assays",
    :biologics => "Biologics",
    :biomarkers => "Biomarkers",
    :cell_lines => "Cell lines",
    :devices => "Devices",
    :diagnostics => "Diagnostics",
    :digital_therapeutics => "Digital therapeutics",
    :drug_delivery_mechanisms => "Drug delivery mechanisms",
    :gene_editing_techniques => "Gene editing techniques",
    :gene_therapies => "Gene therapies",
    :immunotherapies => "Immunotherapies",
    :mechanism_of_action => "Mechanism of Action",
    :pathways => "Pathways",
    :platform_technologies => "Platform technologies",
    :small_molecules => "Small Molecules",
    :targets => "Targets",
    :repurposing => "Repurposing",
    :screening_techniques => "Screening techniques",
  }.freeze

  def as_json(options = { })
    h = super(options)
    h["value"] = INNOVATION_TYPES.with_indifferent_access[value]
    h
  end

  def title
    self.value
  end
end

# == Schema Information
#
# Table name: innovation_types
#
#  id                      :integer          not null, primary key
#  created_at              :datetime
#  updated_at              :datetime
#  request_for_proposal_id :integer
#  value                   :string
#
# Indexes
#
#  index_innovation_types_on_request_for_proposal_id  (request_for_proposal_id)
#  index_innovation_types_on_value                    (value)
#
