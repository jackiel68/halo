class MarketplacesController < ApplicationController
  layout "clean", :only => [:index]
  before_filter :redirect_to_onboarding

  def index
    # TODO: separate the several routes leading to this controller action into their own controller actions
    reducer = ->(key, value) {
      {
        key: key.to_s,
        text: value.to_s,
        value: key.to_s,
      }
    }

    @title = "Halo"

    @areas_of_expertise = UserProfileInfo::AREA_OF_EXPERTISE.map(&reducer)

    @innovation_types = InnovationType::INNOVATION_TYPES.map(&reducer)

    gon.funding_source_types = Funding::SPONSOR_TYPES.map(&reducer)

    gon.patent_statuses = Patent::STATUSES.map(&reducer)

    possible_result_ids = []

    # Submit Proposal
    gon.rfp_identifier = params[:rfp_identifier]

    if gon.rfp_identifier
      rfp = RequestForProposal.where(:identifier => gon.rfp_identifier).first
      gon.rfp_id = rfp.id
      gon.rfp = rfp

      existing_proposal = current_user.proposals.where({ request_for_proposal_id: rfp, completed: false }).first
      gon.existing_proposal = existing_proposal

      if existing_proposal
        gon.proposal_patents = ProposalsPatent.where(:proposal_id => existing_proposal.id).map(&:patent_id)
        gon.proposal_publications = ProposalsPublication.where(:proposal_id => existing_proposal.id).map(&:publication_id)
        gon.proposal_fundings = ProposalsFunding.where(:proposal_id => existing_proposal.id).map(&:funding_id)
      end
    end

    # Results from marketplace search
    if (params[:innovation_types].present? || params[:therapeutic_areas].present?)
      if params[:innovation_types].present?
        possible_result_ids +=
          InnovationType.
            where(:value => params[:innovation_types].split(',')).
            map(&:request_for_proposal_id)
      end

      if params[:therapeutic_areas].present?
        possible_result_ids +=
          RequestForProposal.where(:therapeutic_area => params[:therapeutic_areas].split(',')).
          map(&:id)
      end

      results = RequestForProposal.enabled.where(:id => possible_result_ids)
    else
      results = RequestForProposal.enabled.all
    end

    # TODO: Pull from API
    gon.all_rfps = RequestForProposal.enabled.all

    if user_signed_in?
      profile_info = UserProfileInfo.where(:user_id => current_user.id).last
      gon.current_user = {
        id: current_user.id,
        profile_id: current_user.profile_id,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        email: current_user.email,
        image: current_user.image,
        default_image: ImageUploader::DEFAULT_IMAGE,
        name: current_user.name,
        role: current_user.role,
        company: CompaniesRelation.company_for_user(current_user),
        title: UserProfileInfo::TITLE[profile_info.try(:title).try(:to_sym)] || '',
        keywords: ResearchKeyword.where(:id => current_user.user_keywords.map(&:research_keyword_id)).map(&:research_type)  || [],
      }
      gon.current_user_id = current_user.id
      gon.current_user_profile_id = current_user.profile_id
    end

    gon.default_pf_image = ImageUploader::DEFAULT_IMAGE


    rfp_page_rfp = RequestForProposal.find_by_identifier(params[:opportunity])
    gon.incomplete_proposals = current_user ? current_user.proposals.where({ request_for_proposal_id: rfp_page_rfp, completed: false }) : []


    gon.areas_of_expertise = @areas_of_expertise
    gon.innovation_types = @innovation_types
    gon.rfp_count = results.count
    gon.saved_rfps =
      UserSavedRequestForProposal.where(
        :request_for_proposal => results.map(&:id),
        :user => current_user,
      ).map(&:request_for_proposal_id).reduce({}) do |acc, curr|
        acc[curr] = true
        acc
      end
    gon.followed_companies =
      CompanyFollower.where(
        :user => current_user,
      ).map(&:company_id).reduce({}) do |acc, curr|
        acc[curr] = true
        acc
      end
    gon.rfp_results = results.as_json
    gon.logged_in = user_signed_in?
    gon.innovation_type_mapping = InnovationType::INNOVATION_TYPES
    gon.areas_of_expertise_mapping = UserProfileInfo::AREA_OF_EXPERTISE
    gon.areas_of_expertise_inverse_mapping = UserProfileInfo::AREA_OF_EXPERTISE.invert
    gon.available_resource_mapping = AvailableResource::RESOURCE_TYPES
    gon.funding_source_type_mapping = Funding::SPONSOR_TYPES
    gon.nih_grant_types = Funding::NIH_GRANT_TYPES

    if params[:saved]
      flash.now[:notice] = "Saved!"
    end
  end

  # Search params:
  #   innovation_types: "targets,small_molecules,repurposing,pathways"
  #   therapeutic_areas: "immunology,oncology"
  #   type: "all"
  def search
    possible_result_ids = []

    if (params[:innovation_types].present? || params[:therapeutic_areas].present?)
      if params[:innovation_types].present?
        possible_result_ids +=
          InnovationType.
            where(:value => params[:innovation_types].split(',')).
            map(&:request_for_proposal_id)
      end

      if params[:therapeutic_areas].present?
        possible_result_ids +=
          RequestForProposal.where(:therapeutic_area => params[:therapeutic_areas].split(',')).
          map(&:id)
      end

      results = RequestForProposal.where(:id => possible_result_ids)
    else
      results = RequestForProposal.all
    end

    render :json => {
      :request_for_proposals => results,
      :count => results.count,
    }
  end
end
