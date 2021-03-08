import {
  emptyActionGenerator,
  payloadActionGenerator
} from '../utils/redux';
import { authenticityToken } from '../utils/requests';

export const LOAD_REQUEST_FOR_PROPOSALS = 'LOAD_REQUEST_FOR_PROPOSALS';
export const SET_REQUEST_FOR_PROPOSALS = 'SET_REQUEST_FOR_PROPOSALS';
export const LOAD_REQUEST_FOR_PROPOSALS_BY_RESEARCH = 'LOAD_REQUEST_FOR_PROPOSALS_BY_RESEARCH';
export const SET_REQUEST_FOR_PROPOSALS_BY_RESEARCH = 'SET_REQUEST_FOR_PROPOSALS_BY_RESEARCH';
export const LOAD_PROPOSALS = 'LOAD_PROPOSALS';
export const SET_PROPOSALS = 'SET_PROPOSALS';
export const SET_REVIEWER_DASHBOARD_RFP = 'SET_REVIEWER_DASHBOARD_RFP';
export const SET_PROPOSAL_DASHBOARD_RFP = 'SET_PROPOSAL_DASHBOARD_RFP';

export const loadRequestForProposals = payloadActionGenerator(LOAD_REQUEST_FOR_PROPOSALS);
export const setRequestForProposals = payloadActionGenerator(SET_REQUEST_FOR_PROPOSALS);
export const loadRequestForProposalsByResearch = payloadActionGenerator(LOAD_REQUEST_FOR_PROPOSALS_BY_RESEARCH);
export const setRequestForProposalsByResearch = payloadActionGenerator(SET_REQUEST_FOR_PROPOSALS_BY_RESEARCH);
export const loadProposals = payloadActionGenerator(LOAD_PROPOSALS);
export const setProposals = payloadActionGenerator(SET_PROPOSALS);
export const setReviewerDashboardRFP = payloadActionGenerator(SET_REVIEWER_DASHBOARD_RFP);
export const setProposalDashboardRFP = payloadActionGenerator(SET_PROPOSAL_DASHBOARD_RFP);

export const fetchRequestForProposals = (companyId) => {
  return async (dispatch) => {
    dispatch(loadRequestForProposals());

    const response = await fetch(`/request_for_proposals?company_id=${companyId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setRequestForProposals(responseJson.request_for_proposals));

    return responseJson.request_for_proposals;
  }
}

export const fetchRequestForProposalsByResearchArea = (researchArea) => {
  return async (dispatch) => {
    dispatch(loadRequestForProposalsByResearch());

    const response = await fetch(`/request_for_proposals?research_area=${researchArea}&enabled=true`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setRequestForProposalsByResearch(responseJson.request_for_proposals));

    return responseJson.request_for_proposals;
  }
}

export const fetchProposals = (rfpId) => {
  return async (dispatch) => {
    dispatch(loadProposals());

    const response = await fetch(`/proposals?request_for_proposal_id=${rfpId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setProposals(responseJson.proposals));

    return responseJson.proposals;
  }
}
