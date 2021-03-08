class AddStripeIdToDonations < ActiveRecord::Migration
  def change
    rename_column :donations, :braintree_transaction_id, :stripe_charge_id
    rename_column :users, :braintree_customer_id, :stripe_customer_id
  end
end
