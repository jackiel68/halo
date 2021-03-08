class CreateEducations < ActiveRecord::Migration
  def change
    create_table :educations do |t|
      t.timestamps
      t.references :user
      t.string :location
      t.string :degree
      t.string :start_year
      t.string :end_year
    end

    add_index :educations, :user_id
  end
end
