class AddLaunchDatesToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :launched_at, :datetime
    add_column :campaigns, :closed_at, :datetime
  end
end
