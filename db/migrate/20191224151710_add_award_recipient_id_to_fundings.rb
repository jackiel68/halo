class AddAwardRecipientIdToFundings < ActiveRecord::Migration
  def change
    add_column :fundings, :award_recipient_id, :integer

    add_index :fundings, :award_recipient_id
  end
end
