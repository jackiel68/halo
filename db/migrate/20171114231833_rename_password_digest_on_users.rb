class RenamePasswordDigestOnUsers < ActiveRecord::Migration
  def change
    rename_column :users, :password_digest, :password_digest_old
  end
end
