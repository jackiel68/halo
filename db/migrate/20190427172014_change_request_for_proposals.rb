class ChangeRequestForProposals < ActiveRecord::Migration
  def change
    remove_column :request_for_proposals, :company, :string
    add_column :request_for_proposals, :company_id, :integer, :null => false, default: 0
  end
end
