class AddDefaultValueToProposalsCompleted < ActiveRecord::Migration
  def up
    change_column_default :proposals, :completed, false

    Proposal.find_each { |p| p.update!(completed: !!p.completed) }
  end

  def down
    change_column_default :proposals, :completed, nil
  end
end
