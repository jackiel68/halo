class CreateCompaniesRelations < ActiveRecord::Migration
  def change
    create_table :companies_relations do |t|
      t.references :company
      t.references :user
    end
    add_index :companies_relations, :company_id
    add_index :companies_relations, :user_id
  end
end
