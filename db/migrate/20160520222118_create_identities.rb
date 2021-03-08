class CreateIdentities < ActiveRecord::Migration
  def change
    create_table :identities do |t|
      t.string :uid, null: false
      t.string :provider, null: false
      t.string :name, null: false, default: ''
      t.string :email, null: false, default: ''
      t.string :image, null: false, default: ''
      t.references :user

      t.timestamps
    end

    add_index :identities, :user_id
  end
end
