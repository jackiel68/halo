class AddOtherSponsorToFundings < ActiveRecord::Migration
  def change
    add_column :fundings, :other_sponsor, :string
  end
end
