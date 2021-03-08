class AddAmountToDonations < ActiveRecord::Migration
  def change
    add_column :donations, :amount, :decimal, precision: 8, scale: 2, default: 0.0
    change_column :campaigns, :goal, :decimal, precision: 8, scale: 2, default: 0.0
  end
end
