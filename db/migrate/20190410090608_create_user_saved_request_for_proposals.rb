class CreateUserSavedRequestForProposals < ActiveRecord::Migration
  def change
    create_table :user_saved_request_for_proposals do |t|
      t.timestamps
      t.references :user
      t.references :request_for_proposal
    end

    add_index :user_saved_request_for_proposals, :user_id
    add_index :user_saved_request_for_proposals,
      :request_for_proposal_id,
      :name => 'index_user_saved_rfp_on_rfp_id'
  end
end
