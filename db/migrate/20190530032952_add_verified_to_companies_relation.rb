class AddVerifiedToCompaniesRelation < ActiveRecord::Migration
  def change
    add_column :companies_relations, :verified, :boolean
  end
end
