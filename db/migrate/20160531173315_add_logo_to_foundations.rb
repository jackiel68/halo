class AddLogoToFoundations < ActiveRecord::Migration
  def change
    add_column :foundations, :logo, :string, null: false, default: ''
  end
end
