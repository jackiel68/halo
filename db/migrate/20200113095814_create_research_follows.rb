class CreateResearchFollows < ActiveRecord::Migration
  def change
    create_table :research_follows do |t|
      t.timestamps
      t.string :email
      t.string :research_area
    end

    add_index :research_follows, :email
    add_index :research_follows, [:research_area, :email], unique: true
  end
end
