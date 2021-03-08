  class CreateProposals < ActiveRecord::Migration
  def change
    create_table :proposals do |t|
      t.timestamps
      t.references :request_for_proposal
      t.references :user
      t.text :research_hypothesis
      t.text :hypothesis_basis
      t.text :validation_procedure
      t.text :future_validation
    end
  end
end
