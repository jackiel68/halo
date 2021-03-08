class AddFieldsToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :submitted_for_pi, :boolean, default: false
  end
end
