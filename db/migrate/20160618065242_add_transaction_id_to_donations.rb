class AddTransactionIdToDonations < ActiveRecord::Migration
  def change
    add_column :donations, :braintree_transaction_id, :string
    add_column :donations, :status, :string, null: false, default: 'pending'
    add_column :donations, :parent_donation_id, :integer
  end
end
