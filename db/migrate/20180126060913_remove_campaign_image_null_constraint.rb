class RemoveCampaignImageNullConstraint < ActiveRecord::Migration
  def change
    change_column_null :campaigns, :image, true 
  end
end
