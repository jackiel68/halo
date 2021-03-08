class AddFieldsToDiseases < ActiveRecord::Migration
  def change
    add_column :diseases, :intro, :text, null: false, default: ''
    add_column :diseases, :image, :text, null: false, default: ''
  end
end
