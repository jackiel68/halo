class AddIssueDateToPatents < ActiveRecord::Migration
  def change
    add_column :patents, :issue_date, :datetime
  end
end
