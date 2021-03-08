class AddStatusToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :status, :int
    add_index :proposals, [:request_for_proposal_id, :status]
  end
end
