class AddUniqueIndexesOnUsersTable < ActiveRecord::Migration
  def change
    add_index :users, :email, unique: true
    add_index :users, :auth_token, unique: true
    add_index :users, :referrer_token, unique: true
  end
end
