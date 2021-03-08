class AddPositionToDiseases < ActiveRecord::Migration
  def change
    add_column :diseases, :position, :integer
  end
end
