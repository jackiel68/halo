class AddImageToRfp < ActiveRecord::Migration
  def change
    add_column :request_for_proposals, :image, :string, null: false, default: ''
  end
end
