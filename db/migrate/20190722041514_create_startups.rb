class CreateStartups < ActiveRecord::Migration
  def change
    create_table :startups do |t|
      t.timestamps
      t.references :user
      t.string :startup_name
      t.string :url
      t.string :start_year
      t.string :end_year
    end

    add_index :startups, :user_id
  end
end
