class AddSponsorTypeToFundings < ActiveRecord::Migration
  def change
    add_column :fundings, :sponsor_type, :string
    add_column :fundings, :grant_type, :string
  end
end
