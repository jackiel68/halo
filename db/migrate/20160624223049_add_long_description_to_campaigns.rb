class AddLongDescriptionToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :long_description, :text, null: false, default: ''
  end
end
