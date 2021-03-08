class CreateEmailResponseTemplates < ActiveRecord::Migration
  def change
    create_table :email_response_templates do |t|
      t.timestamps
      t.references :user
      t.text :content
      t.string :title
    end
  end
end
