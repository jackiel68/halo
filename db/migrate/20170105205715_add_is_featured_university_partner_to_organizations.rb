class AddIsFeaturedUniversityPartnerToOrganizations < ActiveRecord::Migration
  def change
    add_column :organizations, :is_university, :boolean, null: false, default: false
    add_column :organizations, :tagline, :string, null: false, default: ''
  end
end
