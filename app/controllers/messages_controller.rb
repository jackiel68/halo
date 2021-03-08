require 'mail'

class MessagesController < ApplicationController
  before_filter :require_user!

  def proposal_contact
    @proposal = Proposal.find(params[:proposal_id])
    @user = @proposal.user
    UserMailer.proposal_contact(@user, current_user.email, params[:message], @proposal).deliver_now
    @proposal.status = Proposal::STATUS.values.include?(params[:status].to_i) ? params[:status] : @proposal.status
    @proposal.save

    flash[:notice] = "Your message has been sent!"

    respond_to do |format|
      format.json { render json: { :success => true } }
    end
  end

  def share_proposal
    @proposal = Proposal.find(params[:proposal_id])
    @email = params[:email]
    @first_name = params[:first_name]
    @last_name = params[:last_name]
    UserMailer.share_proposal(@email, @first_name, @last_name, current_user, params[:message], @proposal).deliver_now

    flash[:notice] = "Your message has been sent!"

    respond_to do |format|
      format.json { render json: { :success => true } }
    end
  end

  def request_for_proposal_contact
    @rfp = RequestForProposal.find(params[:request_for_proposal_id])
    @to_emails = params[:to_emails].split(',').map(&:strip)

    @to_emails.each do |email|
      begin
        Mail::Address.new(email)
      rescue Mail::Field::ParseError
        Rails.logger.error("Request for Proposal Invite email not valid: #{email}")
      end
      UserMailer.request_for_proposal_contact(
        email,
        current_user,
        params[:message],
        @rfp
      ).deliver_now
    end

    flash[:notice] = "Your message has been sent!"

    respond_to do |format|
      format.json { render json: { :success => true } }
    end
  end
end
