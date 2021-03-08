class RenameFoundations < ActiveRecord::Migration
  def up
    change_column :foundations, :disease_id, :integer, null: true
    rename_table :foundations, :organizations
    add_column :campaigns, :sponsor_id, :integer
    add_column :organizations, :type, :string
  end

  def down
    rename_table :organizations, :foundations
    change_column :foundations, :disease_id, :integer, null: false
    remove_column :campaigns, :sponsor_id, :integer
    remove_column :foundations, :type, :string
  end
end
