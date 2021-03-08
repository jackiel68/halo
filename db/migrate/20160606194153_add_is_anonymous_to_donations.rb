class AddIsAnonymousToDonations < ActiveRecord::Migration
  def change
    add_column :donations, :is_anonymous, :boolean, null: false, default: false
  end
end
