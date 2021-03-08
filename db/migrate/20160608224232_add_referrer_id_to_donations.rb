class AddReferrerIdToDonations < ActiveRecord::Migration
  def change
    add_column :donations, :referrer_id, :integer
  end
end
