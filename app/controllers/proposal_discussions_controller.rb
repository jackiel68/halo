class ProposalDiscussionsController < ApplicationController
  layout "clean", :only => [:submit_proposal]

  before_filter :require_user!, :only => [:create, :update, :index]

  def create
    proposal = Proposal.find(params[:proposal_id])

    if proposal.request_for_proposal.company.id != current_user.company.id
      respond_to do |format|
        format.json {
          return render json: { success: false, error: "User not allowed to comment on this proposal"}
        }
      end
      return
    end

    begin
      ProposalDiscussion.transaction do
        proposal_discussion ||= ProposalDiscussion.new
        proposal_discussion.user_id = current_user.id
        proposal_discussion.proposal_id = proposal.id
        proposal_discussion.text = params[:text]
        proposal_discussion.save
      end
    rescue => e
      respond_to do |format|
        format.json {
          return render json: { success: false, error: e.messages }
        }
      end
    end

    respond_to do |format|
      format.json {
        return render json: { success: true }
      }
    end
  end

  def update
    proposal_discussion = ProposalDiscussion.find(params[:id])

    if proposal_discussion.user_id != current_user.id
      respond_to do |format|
        format.json {
          return render json: { success: false, error: "User not allowed to update this comment" }
        }
      end
      return
    end

    proposal_discussion.text = params[:text] if params[:text]
    proposal_discussion.deleted_at = DateTime.now if params[:delete]

    proposal_discussion.save

    respond_to do |format|
      format.json {
        return render json: { success: true }
      }
    end
  end

  def index
    proposal = Proposal.find(params[:proposal_id])

    if proposal.request_for_proposal.company.id != current_user.company.id
      respond_to do |format|
        format.json {
          return render json: { success: false, error: "User not allowed to access discussion"}
        }
      end
      return
    end

    proposal_discussions =
      ProposalDiscussion.where(:proposal_id => params[:proposal_id]).where(:deleted_at => nil)

    respond_to do |format|
      format.json {
        return render json: { success: true, proposal_discussions: proposal_discussions }
      }
    end
  end
end
