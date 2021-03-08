class CreateUserFollows < ActiveRecord::Migration
  def change
    create_table :user_follows do |t|
      t.timestamps
      t.references :company
      t.references :user
    end

    add_index :user_follows, :user_id
    add_index :user_follows, :company_id
  end
end
