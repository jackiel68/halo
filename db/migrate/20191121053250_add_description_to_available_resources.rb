class AddDescriptionToAvailableResources < ActiveRecord::Migration
  def change
    add_column :available_resources, :description, :text
  end
end
