class AddCoverToDiseases < ActiveRecord::Migration
  def change
    add_column :diseases, :cover, :string
    add_column :diseases, :feature_on_homepage, :boolean, null: false, default: false
  end
end
