class AddDetailsUserProfileInfo < ActiveRecord::Migration
  def change
    add_column :user_profile_infos, :location_details, :string
    add_column :user_profile_infos, :location_start_year, :string
    add_column :user_profile_infos, :location_end_year, :string
  end
end
