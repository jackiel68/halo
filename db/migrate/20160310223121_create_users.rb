class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false, default: ''
      t.boolean :omniauth_only, null: false, default: false
      t.string :auth_token, null: false, default: ''
      t.string :referrer_token, null: false, default: ''
      t.boolean :is_admin, null: false, default: false

      t.timestamps
    end
  end
end
