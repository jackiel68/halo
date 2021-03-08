class ProposalsController < ApplicationController
  layout "clean", :only => [:submit_proposal]

  before_filter :require_user!, :only => [:submit_proposal, :create]

  def submit_proposal
    gon.rfp_identifier = params[:rfp_identifier]
    rfp = RequestForProposal.where(:identifier => gon.rfp_identifier).first
    gon.rfp_id = rfp.id
    gon.rfp = rfp

    existing_proposal =
      Proposal.where(:user_id => current_user.id, :request_for_proposal_id => rfp.id).first

    gon.funding_source_types = Funding::SPONSOR_TYPES.map do |key, value|
      {
        key: key.to_s,
        text: value.to_s,
        value: key.to_s,
      }
    end

    gon.existing_proposal = existing_proposal
    gon.current_user_id = current_user.id
    gon.current_user_profile_id = current_user.profile_id
    gon.patents = Patent.where(:user_id => current_user.id)
    gon.fundings = Funding.where(:user_id => current_user.id)
    gon.publications = Publication.where(:user_id => current_user.id)
    gon.companies = Company.all
    gon.foundations = Foundation.all
    gon.government_organizations = GovernmentOrganization.all
    gon.funding_source_type_mapping = Funding::SPONSOR_TYPES
    gon.nih_grant_types = Funding::NIH_GRANT_TYPES
    gon.available_resource_mapping = AvailableResource::RESOURCE_TYPES

    if existing_proposal
      gon.proposal_patents = ProposalsPatent.where(:proposal_id => existing_proposal.id).map(&:patent_id)
      gon.proposal_publications = ProposalsPublication.where(:proposal_id => existing_proposal.id).map(&:publication_id)
      gon.proposal_fundings = ProposalsFunding.where(:proposal_id => existing_proposal.id).map(&:funding_id)
    end
  end

  def index
    @proposals = Proposal.where(:request_for_proposal_id => params[:request_for_proposal_id], :completed => true).order('first_completed_at ASC')

    render json: { :proposals => @proposals }
  end

  def update
    @proposal = Proposal.find(params[:proposal_id])
    if Proposal::STATUS.values.include?(params[:status].to_i)
      @proposal.status = params[:status]
      @proposal.save
      @proposal.reload
    end

    render json: { success: true, :proposal => @proposal }
  end

  def create
    success = false
    proposal_params = params[:proposal]

    proposal = Proposal.where(
      :request_for_proposal_id => proposal_params[:request_for_proposal_id],
      :user_id => current_user.id,
      :completed => false
    ).first

    if proposal && proposal.user_id != current_user.id
      respond_to do |format|
        format.json {
          return render json: { success: false, error: "User not allowed to modify this proposal"}
        }
      end
      return
    end

    proposal ||= Proposal.new
    begin
      Proposal.transaction do
        proposal.user_id = current_user.id
        proposal.request_for_proposal_id = proposal_params[:request_for_proposal_id]
        proposal.research_hypothesis = proposal_params[:research_hypothesis]
        proposal.hypothesis_basis = proposal_params[:hypothesis_basis]
        proposal.validation_procedure = proposal_params[:validation_procedure]
        proposal.future_validation = proposal_params[:future_validation]
        proposal.completed = true if proposal_params[:completed]
        proposal.first_completed_at = DateTime.now unless proposal.first_completed_at
        proposal.submitted_for_pi = true if proposal_params[:submitted_for_pi]
        proposal.save!

        if proposal_params[:fundings].present?
          proposal_params[:fundings].split(",").each do |funding_id|
            ProposalsFunding.find_or_create_by(
              :proposal_id => proposal.id,
              :funding_id => funding_id
            )
          end
        end


        if proposal_params[:patents].present?
          proposal_params[:patents].split(",").each do |patent_id|
            ProposalsPatent.find_or_create_by(
              :proposal_id => proposal.id,
              :patent_id => patent_id
            )
          end
        end


        if proposal_params[:publications].present?
          proposal_params[:publications].split(",").each do |publication_id|
            ProposalsPublication.find_or_create_by(
              :proposal_id => proposal.id,
              :publication_id => publication_id
            )
          end
        end
      end
    rescue
      respond_to do |format|
        format.json {
          return render json: { success: false }
        }
      end
    end

    respond_to do |format|
      format.json {
        return render json: { proposal: proposal, success: true }
      }
    end
  end
end
