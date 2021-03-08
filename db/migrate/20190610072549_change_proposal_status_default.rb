class ChangeProposalStatusDefault < ActiveRecord::Migration
  def change
    change_column_default :proposals, :status, 0
    change_column_null :proposals, :status, false
  end
end
