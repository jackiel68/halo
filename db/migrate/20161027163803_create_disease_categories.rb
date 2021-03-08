class CreateDiseaseCategories < ActiveRecord::Migration
  def change
    create_table :disease_categories do |t|
      t.string :name, null: false, default: ''
      t.text :description, null: false, default: ''
      t.string :image
      t.string :slug
      t.boolean :feature_on_homepage, null: false, default: false
      t.integer :position

      t.timestamps
    end

    create_table :disease_categories_diseases, id: false do |t|
      t.belongs_to :disease_category, index: true
      t.belongs_to :disease, index: true
    end
  end
end
