class AddStatusToPatents < ActiveRecord::Migration
  def change
    add_column :patents, :status, :string
  end
end
