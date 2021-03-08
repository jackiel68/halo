class AddFacebookShareImageToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :facebook_image, :string, null: true, default: ''
  end
end
