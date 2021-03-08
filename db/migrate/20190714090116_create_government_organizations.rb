class CreateGovernmentOrganizations < ActiveRecord::Migration
  def change
    create_table :government_organizations do |t|
      t.string :org_name
      t.text :description
    end
    add_index :government_organizations, :org_name
  end
end
