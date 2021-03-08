class CreateInnovationTypes < ActiveRecord::Migration
  def change
    remove_column :request_for_proposals, :innovation_type, :string

    create_table :innovation_types do |t|
      t.timestamps
      t.references :request_for_proposal
      t.string :value
    end

    add_index :innovation_types, :request_for_proposal_id
    add_index :innovation_types, :value
  end
end
