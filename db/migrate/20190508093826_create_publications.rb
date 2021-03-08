class CreatePublications < ActiveRecord::Migration
  def change
    create_table :publications do |t|
      t.timestamps
      t.references :user
      t.string :title
      t.text :description
    end

    add_index :publications, :user_id
  end
end
