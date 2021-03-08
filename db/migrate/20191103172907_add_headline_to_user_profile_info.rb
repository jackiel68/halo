class AddHeadlineToUserProfileInfo < ActiveRecord::Migration
  def change
    add_column :user_profile_infos, :headline, :string
  end
end
