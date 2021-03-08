class CreateRequestForProposals < ActiveRecord::Migration
  def change
    create_table :request_for_proposals do |t|
      t.timestamps
      t.references :user
      t.string :first_name
      t.string :last_name
      t.string :work_email
      t.string :company
      t.string :innovation_type
      t.string :therapeutic_area
      t.text :why_it_matters
      t.text :in_scope_proposals
      t.text :out_of_scope_proposals
      t.text :available_resources
      t.text :additional_resource_details
      t.datetime :deadline
    end

    add_index :request_for_proposals, :user_id
  end
end
