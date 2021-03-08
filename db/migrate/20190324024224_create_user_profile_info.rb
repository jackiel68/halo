class CreateUserProfileInfo < ActiveRecord::Migration
  def change
    create_table :user_profile_infos do |t|
      t.string :title
      t.string :location
      t.string :area_of_expertise
      t.references :user

      t.timestamps
    end

    add_index :user_profile_infos, :user_id
  end
end
