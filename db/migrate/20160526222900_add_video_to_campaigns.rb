class AddVideoToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :video, :string, null: false, default: ''
    add_column :campaigns, :is_featured, :boolean, null: false, default: false
  end
end
