class CreateFollowers < ActiveRecord::Migration
  def change
    create_table :followers do |t|
      t.references :campaign, index: true, foreign_key: true
      t.string :email, null: false

      t.timestamps null: false
    end

    add_index :followers, :email, unique: true
  end
end
