class CreateAvailableResources < ActiveRecord::Migration
  def change
    remove_column :request_for_proposals, :available_resources, :string

    create_table :available_resources do |t|
      t.timestamps
      t.references :request_for_proposal
      t.string :resource_type
    end

    add_index :available_resources, :request_for_proposal_id
    add_index :available_resources, :resource_type
  end
end
