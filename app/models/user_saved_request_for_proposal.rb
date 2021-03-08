class UserSavedRequestForProposal < ActiveRecord::Base
  belongs_to :user
  belongs_to :request_for_proposal
end

# == Schema Information
#
# Table name: user_saved_request_for_proposals
#
#  id                      :integer          not null, primary key
#  created_at              :datetime
#  updated_at              :datetime
#  user_id                 :integer
#  request_for_proposal_id :integer
#
# Indexes
#
#  index_user_saved_request_for_proposals_on_user_id  (user_id)
#  index_user_saved_rfp_on_rfp_id                     (request_for_proposal_id)
#
