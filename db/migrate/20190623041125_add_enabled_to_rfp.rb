class AddEnabledToRfp < ActiveRecord::Migration
  def change
    add_column :request_for_proposals, :enabled, :boolean
  end
end
