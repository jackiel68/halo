class CreateCampaignNotes < ActiveRecord::Migration
  def change
    create_table :campaign_notes do |t|
      t.integer :advisor_id, null: false
      t.integer :campaign_id, null: false
      t.string :title, null: false, default: ''
      t.text :description, null: false, default: ''

      t.timestamps
    end
  end
end
