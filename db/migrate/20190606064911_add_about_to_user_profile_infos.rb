class AddAboutToUserProfileInfos < ActiveRecord::Migration
  def change
    add_column :user_profile_infos, :about, :text
  end
end
