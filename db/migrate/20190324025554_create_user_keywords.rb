class CreateUserKeywords < ActiveRecord::Migration
  def change
    create_table :user_keywords do |t|
      t.string :value
      t.references :user

      t.timestamps
    end

    add_index :user_keywords, :user_id
  end
end
