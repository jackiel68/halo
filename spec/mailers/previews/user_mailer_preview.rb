# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def proposal_contact
    UserMailer.proposal_contact(User.first, "justinkchen14@gmail.com", "Testing a message", Proposal.first)
  end

  def share_proposal
    UserMailer.share_proposal("justinkchen14@gmail.com", "Justin", "Chen", User.first, "Test message", Proposal.first)
  end

  def request_for_proposal_contact
    email = 'devstarks@gmail.com'
    reply_to = User.where(role: User::ROLES[:university]).last
    message = "This is a sample message"
    rfp = RequestForProposal.first

    UserMailer.request_for_proposal_contact(email, reply_to, message, rfp)
  end
end
