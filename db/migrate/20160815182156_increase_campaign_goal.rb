class IncreaseCampaignGoal < ActiveRecord::Migration
  def change
    change_column :campaigns, :goal, :decimal, precision: 11, scale: 2, default: 0.0
  end
end
