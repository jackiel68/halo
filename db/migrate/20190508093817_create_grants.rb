class CreateGrants < ActiveRecord::Migration
  def change
    create_table :grants do |t|
      t.timestamps
      t.references :user
      t.string :title
      t.text :description
    end

    add_index :grants, :user_id
  end
end
