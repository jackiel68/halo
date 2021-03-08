class AddTitleSummaryToRfp < ActiveRecord::Migration
  def change
    add_column :request_for_proposals, :title, :string
    add_column :request_for_proposals, :summary, :text
  end
end
