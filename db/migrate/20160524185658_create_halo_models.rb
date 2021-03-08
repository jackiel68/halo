class CreateHaloModels < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.string :name, null: false, default: ''
      t.string :slug, null: false, default: ''
      t.text :description, null: false, default: ''
      t.text :use_of_funds, null: false, default: ''
      t.text :timeline, null: false, default: ''
      t.text :risks, null: false, default: ''
      t.float :goal
      t.datetime :deadline, null: false
      t.references :disease, null: false

      t.timestamps
    end

    create_table :campaign_questions do |t|
      t.string :question, null: false, default: ''
      t.string :answer, null: false, default: ''
      t.integer :position, null: false
      t.references :campaign, null: false

      t.timestamps
    end

    create_table :campaign_advisors do |t|
      t.string :name, null: false, default: ''
      t.string :title, null: false, default: ''
      t.string :sector, null: false, default: ''
      t.string :quote, null: false, default: ''
      t.string :image, null: false, default: ''
      t.references :campaign, null: false

      t.timestamps
    end

    create_table :donations do |t|
      t.references :campaign, null: false
      t.references :user, null: false
      t.string :loved_one_name, null: false, default: ''

      t.timestamps
    end

    create_table :diseases do |t|
      t.string :name, null: false, default: ''
      t.text :description, null: false, default: ''
      t.text :stats, null: false, default: ''

      t.timestamps
    end

    create_table :interests do |t|
      t.references :disease, null: false
      t.references :user, null: false

      t.timestamps
    end

    create_table :foundations do |t|
      t.string :name, null: false, default: ''
      t.string :url, null: false, default: ''
      t.references :disease, null: false

      t.timestamps
    end
  end
end
