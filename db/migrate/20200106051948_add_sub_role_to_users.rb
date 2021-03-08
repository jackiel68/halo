class AddSubRoleToUsers < ActiveRecord::Migration
  def change
    add_column :users, :sub_role, :integer, :null => false, :default => 0
  end
end
