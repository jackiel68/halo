class CreatePatents < ActiveRecord::Migration
  def change
    create_table :patents do |t|
      t.timestamps
      t.references :user
      t.string :title
      t.string :patent_office
      t.string :application_number
      t.string :url
      t.text :description
    end

    add_index :patents, :user_id
  end
end
