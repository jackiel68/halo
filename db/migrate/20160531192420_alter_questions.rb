class AlterQuestions < ActiveRecord::Migration
  def change
    change_column :campaign_questions, :question, :text, null: false, default: ''
    change_column :campaign_questions, :answer, :text, null: false, default: ''
  end
end
