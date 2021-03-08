class CreateProposalDiscussions < ActiveRecord::Migration
  def change
    create_table :proposal_discussions do |t|
      t.references :user
      t.references :proposal
      t.text :text
      t.boolean :deleted_at

      t.timestamps
    end

    add_index :proposal_discussions, :user_id
    add_index :proposal_discussions, :proposal_id
  end
end
