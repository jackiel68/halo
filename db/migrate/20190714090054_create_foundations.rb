class CreateFoundations < ActiveRecord::Migration
  def change
    create_table :foundations do |t|
      t.string :foundation_name
      t.text :description
    end
    add_index :foundations, :foundation_name
  end
end
