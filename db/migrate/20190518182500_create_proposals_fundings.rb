class CreateProposalsFundings < ActiveRecord::Migration
  def change
    create_table :proposals_fundings do |t|
      t.timestamps
      t.references :proposal
      t.references :funding
    end

    add_index :proposals_fundings, :proposal_id
    add_index :proposals_fundings, :funding_id
  end
end
