class ProposalsPublication < ActiveRecord::Base
  belongs_to :proposal
  belongs_to :publication
end

# == Schema Information
#
# Table name: proposals_publications
#
#  id             :integer          not null, primary key
#  created_at     :datetime
#  updated_at     :datetime
#  proposal_id    :integer
#  publication_id :integer
#
# Indexes
#
#  index_proposals_publications_on_proposal_id     (proposal_id)
#  index_proposals_publications_on_publication_id  (publication_id)
#
