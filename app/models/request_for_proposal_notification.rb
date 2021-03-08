class RequestForProposalNotification < ActiveRecord::Base
  belongs_to :request_for_proposal

  validates_uniqueness_of :email
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
end

# == Schema Information
#
# Table name: request_for_proposal_notifications
#
#  id                      :integer          not null, primary key
#  email                   :string
#  request_for_proposal_id :integer
#  created_at              :datetime
#  updated_at              :datetime
#
# Indexes
#
#  index_request_for_proposal_notifications_on_email  (email) UNIQUE
#  index_rfp_notifications_on_rfp                     (request_for_proposal_id)
#
