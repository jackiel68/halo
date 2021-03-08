class AddBraintreeCustomerIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :braintree_customer_id, :string, null: false, default: ''
  end
end
