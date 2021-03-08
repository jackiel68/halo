class AddSubtitleToRequestForProposals < ActiveRecord::Migration
  def change
    add_column :request_for_proposals, :subtitle, :string
  end
end
