class ProposalDiscussion < ActiveRecord::Base
  belongs_to :proposal
  belongs_to :user

  # Not good for large datasets with N+1 but fine for small outputs
  def as_json(options = { })
    h = super(options)
    h["user"] = User.find_by_id(user_id).try(:for_show)
    h
  end
end

# == Schema Information
#
# Table name: proposal_discussions
#
#  id          :integer          not null, primary key
#  user_id     :integer
#  proposal_id :integer
#  text        :text
#  deleted_at  :boolean
#  created_at  :datetime
#  updated_at  :datetime
#
# Indexes
#
#  index_proposal_discussions_on_proposal_id  (proposal_id)
#  index_proposal_discussions_on_user_id      (user_id)
#
