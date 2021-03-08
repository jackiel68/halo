class CreateResearchKeywords < ActiveRecord::Migration
  def change
    create_table :research_keywords do |t|
      t.timestamps
      t.string :research_type
    end

    add_index :research_keywords, :research_type
  end
end
