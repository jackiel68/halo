class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :company_name
      t.text :description
    end
    add_index :companies, :company_name
  end
end
