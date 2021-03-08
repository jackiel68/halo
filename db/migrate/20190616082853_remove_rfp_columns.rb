class RemoveRfpColumns < ActiveRecord::Migration
  def change
    remove_column :request_for_proposals, :first_name
    remove_column :request_for_proposals, :last_name
    remove_column :request_for_proposals, :work_email
  end
end
