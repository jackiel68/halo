class AddFieldOfStudyToEducations < ActiveRecord::Migration
  def change
    add_column :educations, :field_of_study, :string
  end
end
