class AddImageAndSocialMessageToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :image, :string, null: false, default: ''
    add_column :campaigns, :social_message, :string, null: false, default: ''
  end
end
