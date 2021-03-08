class AddTitleToFundings < ActiveRecord::Migration
  def change
    add_column :fundings, :title, :string
  end
end
