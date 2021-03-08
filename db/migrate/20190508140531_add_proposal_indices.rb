class AddProposalIndices < ActiveRecord::Migration
  def change
    add_index :proposals, :user_id
    add_index :proposals, :request_for_proposal_id
  end
end
