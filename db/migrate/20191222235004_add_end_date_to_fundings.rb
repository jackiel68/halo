class AddEndDateToFundings < ActiveRecord::Migration
  def change
    add_column :fundings, :end_date, :datetime
  end
end
