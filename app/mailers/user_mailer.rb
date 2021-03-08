class UserMailer < ApplicationMailer
  include ActionView::Helpers::SanitizeHelper

  default from: 'no-reply@halocures.com'

  def proposal_contact(to, reply_to, message, proposal)
    @to = to
    @reply_to = reply_to
    @message = sanitize(message)
    @proposal = proposal
    mail(
      to: @to.email,
      from: 'Halo <proposals@halocures.com>',
      reply_to: @reply_to,
      subject: "A message from #{@proposal.request_for_proposal.company.company_name} about your proposal",
    )
  end

  def share_proposal(to_email, first_name, last_name, reply_to, message, proposal)
    @to_email = "#{first_name} #{last_name} <#{to_email}>"
    @first_name = first_name
    @last_name = last_name
    @reply_to = reply_to
    @message = sanitize(message)
    @proposal = proposal
    mail(
      to: @to_email,
      from: 'Halo <proposals@halocures.com>',
      reply_to: @reply_to.email,
      subject: "Proposal from #{@proposal.user.name} for #{@proposal.request_for_proposal.title}",
    )
  end

  def request_for_proposal_contact(email, reply_to, message, request_for_proposal)
    @message = message
    @reply_to = reply_to
    @rfp = request_for_proposal

    mail(
      to: email,
      from: 'Halo <proposals@halocures.com>',
      reply_to: @reply_to.email,
      subject: "#{@reply_to.first_name.capitalize} #{@reply_to.last_name.capitalize} sent you a funding opportunity with #{@rfp.company.company_name}",
    )
  end
end
