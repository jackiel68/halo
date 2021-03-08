class ChangeGrantsToFundings < ActiveRecord::Migration
  def change
    rename_table :grants, :fundings
    add_column :fundings, :sponsor_id, :integer
    add_column :fundings, :date, :datetime
    add_column :fundings, :amount, :decimal
    remove_column :fundings, :title
  end
end
