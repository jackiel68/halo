class AddIdentifierToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :identifier, :string, :unique => true
    add_index :proposals, :identifier
  end
end
