class AddColumnsToPublications < ActiveRecord::Migration
  def change
    rename_column :publications, :description, :abstract
    add_column :publications, :publication_name, :string
    add_column :publications, :date, :datetime
  end
end

