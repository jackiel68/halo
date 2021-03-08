class AlterInterests < ActiveRecord::Migration
  def change
    drop_table :interests

    create_table :diseases_users, id: false do |t|
      t.belongs_to :disease, index: true
      t.belongs_to :user, index: true
    end
  end
end
