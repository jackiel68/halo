class AddDefaultAmountToDonations < ActiveRecord::Migration
  def change
    change_column :donations, :amount, :decimal, precision: 8, scale: 2, default: 0.00
  end
end
