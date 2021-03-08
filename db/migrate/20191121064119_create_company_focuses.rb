class CreateCompanyFocuses < ActiveRecord::Migration
  def change
    create_table :company_focus_types do |t|
      t.string :focus_type
      t.references :company
    end
    add_index :company_focus_types, :company_id
  end
end
