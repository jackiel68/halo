class AddCompletedToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :completed, :boolean
  end
end
