class ProposalsFunding < ActiveRecord::Base
  belongs_to :proposal
  belongs_to :funding
end

# == Schema Information
#
# Table name: proposals_fundings
#
#  id          :integer          not null, primary key
#  created_at  :datetime
#  updated_at  :datetime
#  proposal_id :integer
#  funding_id  :integer
#
# Indexes
#
#  index_proposals_fundings_on_funding_id   (funding_id)
#  index_proposals_fundings_on_proposal_id  (proposal_id)
#
