class AddCompanyTables < ActiveRecord::Migration
  def change
    add_column :companies, :logo_url, :string
    add_column :companies, :company_image_url, :string
    add_column :companies, :hero_image_url, :string
    add_column :companies, :location, :string
    add_column :companies, :employee_count, :string
    add_column :companies, :sales_amount, :string
    add_column :companies, :funding_amount, :string

    create_table :company_reviewers do |t|
      t.string :reviewer_name
      t.string :position
      t.string :image_url
      t.text :introduction
      t.references :company
    end
    add_index :company_reviewers, :company_id

    create_table :company_partners do |t|
      t.string :institution_name
      t.string :partner_name
      t.string :research_area
      t.text :description
      t.references :company
    end
    add_index :company_partners, :company_id

    create_table :company_images do |t|
      t.string :image_url
      t.references :company
    end
    add_index :company_images, :company_id

    create_table :company_quotes do |t|
      t.string :employee_name
      t.string :role
      t.text :quote
      t.string :image_url
      t.references :company
    end
    add_index :company_quotes, :company_id

    create_table :company_followers do |t|
      t.references :company
      t.references :user
    end
    add_index :company_followers, :company_id
    add_index :company_followers, :user_id
  end
end
