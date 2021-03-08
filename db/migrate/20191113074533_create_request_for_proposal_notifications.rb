class CreateRequestForProposalNotifications < ActiveRecord::Migration
  def change
    create_table :request_for_proposal_notifications do |t|
      t.string :email
      t.references :request_for_proposal

      t.timestamps
    end
    add_index :request_for_proposal_notifications, :email, unique: true
    add_index :request_for_proposal_notifications, [:request_for_proposal_id], name: "index_rfp_notifications_on_rfp"
  end
end
