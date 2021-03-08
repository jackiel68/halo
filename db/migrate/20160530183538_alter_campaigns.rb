class AlterCampaigns < ActiveRecord::Migration
  def change
    change_column :campaigns, :slug, :string, null: true, default: nil
    add_column :diseases, :slug, :string
  end
end
