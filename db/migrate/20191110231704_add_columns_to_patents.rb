class AddColumnsToPatents < ActiveRecord::Migration
  def change
    add_column :patents, :abstract, :text
    add_column :patents, :filing_date, :datetime
  end
end
