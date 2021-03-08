class RequestForProposalsController < ApplicationController
  layout "clean", :only => [:new]

  before_filter :redirect_to_onboarding
  before_filter :require_user!, :only => [:create, :toggle_rfp, :save_rfp, :unsave_rfp]

  def new
    user_company = CompaniesRelation.company_for_user(current_user)

    unless user_company
      flash[:error] = "You are not authorized to view this"
      return redirect_to "/"
    end

    @title = "Request For Proposal"

    @areas_of_expertise = UserProfileInfo::AREA_OF_EXPERTISE.map do |key, value|
      {
        key: key.to_s,
        text: value.to_s,
        value: key.to_s,
      }
    end

    @innovation_types = InnovationType::INNOVATION_TYPES.map do |key, value|
      {
        key: key.to_s,
        text: value.to_s,
        value: key.to_s,
      }
    end

    gon.user_company_name = user_company.company_name
    gon.areas_of_expertise = @areas_of_expertise
    gon.innovation_types = @innovation_types
    gon.innovation_type_mapping = InnovationType::INNOVATION_TYPES
    gon.areas_of_expertise_mapping = UserProfileInfo::AREA_OF_EXPERTISE
  end

  def index
    @request_for_proposals = RequestForProposal.all
    if params[:company_id]
      @request_for_proposals = @request_for_proposals.where(:company_id => params[:company_id]).order('id desc')
    end
    if params[:research_area]
      @request_for_proposals = @request_for_proposals.where(:therapeutic_area => params[:research_area])
    end
    if params[:enabled]
      @request_for_proposals = @request_for_proposals.where(:enabled => true)
    end

    respond_to do |format|
      format.json {
        render json: { :request_for_proposals => @request_for_proposals }
      }
    end
  end

  def waitlist
    success = false
    begin
      if params[:request_for_proposal_id]
        rfp = RequestForProposal.find(params[:request_for_proposal_id])

        RequestForProposalNotification.create({
          :request_for_proposal_id => rfp.id,
          :email => params[:email],
        })

        success = true
      end
    rescue
      success = false
    end
    respond_to do |format|
      format.json {
        render json: { :success => success }
      }
    end
  end

  def create
    # params
    # request_for_proposal: {
    #   additional_resources: "asdfasdfas"
    #   available_resources: "mentorship_expertise,compounds_reagents,tools_technologies"
    #   deadline: "Fri Mar 29 2019 03:57:59 GMT-0700 (Pacific Daylight Time)"
    #   in_scope_proposals: "asdfsafdsf"
    #   innovation_types: "targets,small_molecules,repurposing,pathways"
    #   other_resource: ""
    #   out_of_scope_proposals: "sadfasdf"
    #   why_it_matters: "asdfasf"
    #   therapeutic_area: "immunology",
    # }
    user_company = CompaniesRelation.company_for_user(current_user)

    rfp_params = params[:request_for_proposal]
    available_resources =
      rfp_params[:available_resources].split(',') - ['other']
    if rfp_params[:other_resource].present?
      available_resources += [`other-${rfp_params[:other_resource]}`]
    end

    innovation_types = rfp_params[:innovation_types].split(',')

    output = nil
    begin
      RequestForProposal.transaction do
        rfp = RequestForProposal.create({
          :user_id => current_user.id,
          :company_id => user_company.id,
          :title => rfp_params[:title],
          :summary => rfp_params[:summary],
          :therapeutic_area => rfp_params[:therapeutic_area],
          :why_it_matters => rfp_params[:why_it_matters],
          :in_scope_proposals => rfp_params[:in_scope_proposals],
          :out_of_scope_proposals => rfp_params[:out_of_scope_proposals],
          :additional_resource_details => rfp_params[:additional_resources],
          :identifier => RequestForProposal.generate_identifier(rfp_params[:title])
        })

        if rfp_params[:deadline].present?
          rfp.deadline = DateTime.parse(rfp_params[:deadline])
          rfp.save
        end

        if rfp.errors.present?
          output = { :success => false, :errors => rfp.errors }
        else
          available_resources.each do |resource|
            AvailableResource.create({
              :request_for_proposal => rfp,
              :resource_type => resource,
            })
          end

          innovation_types.each do |innovation_type|
            InnovationType.create({
              :request_for_proposal => rfp,
              :value => innovation_type,
            })
          end

          output = { :success => true, :request_for_proposal => rfp_params }
        end
      end
    rescue
      output = { :success => false, :errors => ['Something went wrong, please try again later'] }
    end

    respond_to do |format|
      format.json {
        render json: output
      }
    end
  end

  def toggle_rfp
    rfp = RequestForProposal.find(params[:rfp_id])

    if rfp.user_id != current_user.id
      output = { :success => false, :errors => ['Not allowed to access that'] }
    else
      rfp.enabled = !rfp.enabled
      rfp.save!

      output = { :success => true, :enabled => rfp.enabled }
    end

    respond_to do |format|
      format.json {
        render json: output
      }
    end
  end

  def save_rfp
    rfp = RequestForProposal.find(params[:rfp_id])

    UserSavedRequestForProposal.create({
      :user_id => current_user.id,
      :request_for_proposal_id => rfp.id,
    })

    respond_to do |format|
      format.json {
        render json: { :success => true }
      }
    end
  end

  def unsave_rfp
    rfp = RequestForProposal.find(params[:rfp_id])

    UserSavedRequestForProposal.where(
      :user_id => current_user.id,
      :request_for_proposal_id => rfp.id,
    ).first.try(:destroy)

    respond_to do |format|
      format.json {
        render json: { :success => true }
      }
    end
  end
end
