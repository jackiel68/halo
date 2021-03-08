import {
  LOAD_REQUEST_FOR_PROPOSALS,
  SET_REQUEST_FOR_PROPOSALS,
  LOAD_REQUEST_FOR_PROPOSALS_BY_RESEARCH,
  SET_REQUEST_FOR_PROPOSALS_BY_RESEARCH,
  LOAD_PROPOSALS,
  SET_PROPOSALS,
  SET_REVIEWER_DASHBOARD_RFP,
  SET_PROPOSAL_DASHBOARD_RFP,
}  from '../actions/companyActions';

const initialState = {
  loadingRequestForProposals: false,
  requestForProposals: [],
  loadingProposals: false,
  proposals: [],
  reviewerDashboardRFP: {},
  proposalDashboardRFP: {},
};

const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REQUEST_FOR_PROPOSALS:
      return {
        ...state,
        loadingRequestForProposals: true,
      };
    case SET_REQUEST_FOR_PROPOSALS:
      return {
        ...state,
        requestForProposals: action.payload,
        loadingRequestForProposals: false,
      };
    case LOAD_REQUEST_FOR_PROPOSALS_BY_RESEARCH:
      return {
        ...state,
        loadingRequestForProposalsByResearch: true,
      };
    case SET_REQUEST_FOR_PROPOSALS_BY_RESEARCH:
      return {
        ...state,
        requestForProposalsByResearch: action.payload,
        loadingRequestForProposalsByResearch: false,
      };
    case LOAD_PROPOSALS:
      return {
        ...state,
        loadingProposals: true,
      };
    case SET_PROPOSALS:
      return {
        ...state,
        proposals: action.payload,
        loadingProposals: false,
      }
    case SET_REVIEWER_DASHBOARD_RFP:
      return {
        ...state,
        reviewerDashboardRFP: action.payload,
      };
    case SET_PROPOSAL_DASHBOARD_RFP:
      return {
        ...state,
        proposalDashboardRFP: action.payload,
      }
    default:
      return state;
  }
};
export default companyReducer;
