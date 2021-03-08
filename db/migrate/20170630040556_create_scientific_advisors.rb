class CreateScientificAdvisors < ActiveRecord::Migration
  def change
    create_table :scientific_advisors do |t|
   	  t.string :full_name
   	  t.string :title
   	  t.string :institution
   	  t.string :linkedin_profile
   	  t.string :image, null: false, default: ''
    end
  end
end
