class ChangeUserKeywordColumn < ActiveRecord::Migration
  def change
    remove_column :user_keywords, :value
    add_column :user_keywords, :research_keyword_id, :integer
    add_index :user_keywords, :research_keyword_id
  end
end
