class AddLaunchDateToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :launch_date, :datetime
    add_column :campaigns, :cover, :string, null: false, default: ''
  end
end
