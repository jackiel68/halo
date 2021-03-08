class RemoveVideosFromCampaigns < ActiveRecord::Migration
  def change
    remove_column :campaigns, :video
  end
end
