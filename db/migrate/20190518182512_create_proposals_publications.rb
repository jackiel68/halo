class CreateProposalsPublications < ActiveRecord::Migration
  def change
    create_table :proposals_publications do |t|
      t.timestamps
      t.references :proposal
      t.references :publication
    end

    add_index :proposals_publications, :proposal_id
    add_index :proposals_publications, :publication_id
  end
end
