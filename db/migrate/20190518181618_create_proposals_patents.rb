class CreateProposalsPatents < ActiveRecord::Migration
  def change
    create_table :proposals_patents do |t|
      t.timestamps
      t.references :proposal
      t.references :patent
    end

    add_index :proposals_patents, :proposal_id
    add_index :proposals_patents, :patent_id
  end
end
