class AddUrlToFundings < ActiveRecord::Migration
  def change
    add_column :fundings, :url, :string
  end
end
