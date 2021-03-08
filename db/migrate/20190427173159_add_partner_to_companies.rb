class AddPartnerToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :is_partner, :boolean, :null => false, default: false
  end
end
