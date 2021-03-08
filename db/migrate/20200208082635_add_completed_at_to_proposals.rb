class AddCompletedAtToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :first_completed_at, :datetime
  end
end
