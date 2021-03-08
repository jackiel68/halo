class AddIdentifiersToRfpAndCompany < ActiveRecord::Migration
  def change
    add_column :request_for_proposals, :identifier, :string
    add_column :companies, :identifier, :string
    add_index :request_for_proposals, :identifier
    add_index :companies, :identifier
  end
end
