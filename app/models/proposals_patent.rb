class ProposalsPatent < ActiveRecord::Base
  belongs_to :proposal
  belongs_to :patent
end

# == Schema Information
#
# Table name: proposals_patents
#
#  id          :integer          not null, primary key
#  created_at  :datetime
#  updated_at  :datetime
#  proposal_id :integer
#  patent_id   :integer
#
# Indexes
#
#  index_proposals_patents_on_patent_id    (patent_id)
#  index_proposals_patents_on_proposal_id  (proposal_id)
#
