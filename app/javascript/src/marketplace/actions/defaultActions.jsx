import {
  emptyActionGenerator,
  payloadActionGenerator
} from '../utils/redux';
import { authenticityToken } from '../utils/requests';

export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const SEARCH_TERM = 'SEARCH_TERM';
export const INITIALIZE_SAVE_RFPS = 'INITIALIZE_SAVE_RFPS';
export const START_SAVE_UNSAVE_RFP = 'START_SAVE_UNSAVE_RFP';
export const FINISH_SAVE_UNSAVE_RFP = 'FINISH_SAVE_UNSAVE_RFP';
export const START_TOGGLE_RFP = 'START_TOGGLE_RFP';
export const FINISH_TOGGLE_RFP = 'FINISH_TOGGLE_RFP';
export const INITIALIZE_FOLLOWED_COMPANIES = 'INITIALIZE_FOLLOWED_COMPANIES';
export const START_FOLLOW_UNFOLLOW_COMPANY = 'START_FOLLOW_UNFOLLOW_COMPANY';
export const FINISH_FOLLOW_UNFOLLOW_COMPANY = 'FINISH_FOLLOW_UNFOLLOW_COMPANY';
export const UPDATE_RESULT_LIST = 'UPDATE_RESULT_LIST';
export const UPDATE_CURRENT_RFP = 'UPDATE_CURRENT_RFP';
export const SET_CURRENT_COMPANY = 'SET_CURRENT_COMPANY';
export const SET_COMPANIES = 'SET_COMPANIES';
export const SET_FOUNDATIONS = 'SET_FOUNDATIONS';
export const SET_GOVERNMENT_ORGANIZATIONS = 'SET_GOVERNMENT_ORGANIZATIONS';

export const addFilter = payloadActionGenerator(ADD_FILTER);
export const removeFilter = payloadActionGenerator(REMOVE_FILTER);
export const searchTerm = payloadActionGenerator(SEARCH_TERM);
export const startSaveUnsaveRFP = payloadActionGenerator(START_SAVE_UNSAVE_RFP);
export const finishSaveUnsaveRFP = payloadActionGenerator(FINISH_SAVE_UNSAVE_RFP);
export const startToggleRFP = payloadActionGenerator(START_TOGGLE_RFP);
export const finishToggleRFP = payloadActionGenerator(FINISH_TOGGLE_RFP);
export const startFollowUnfollowCompany = payloadActionGenerator(START_FOLLOW_UNFOLLOW_COMPANY);
export const finishFollowUnfollowCompany = payloadActionGenerator(FINISH_FOLLOW_UNFOLLOW_COMPANY);
export const initializeSaveRFPs = payloadActionGenerator(INITIALIZE_SAVE_RFPS);
export const initializeFollowedCompanies = payloadActionGenerator(INITIALIZE_FOLLOWED_COMPANIES);
export const updateResultList = payloadActionGenerator(UPDATE_RESULT_LIST);
export const updateCurrentRFP = payloadActionGenerator(UPDATE_CURRENT_RFP);
export const setCurrentCompany = payloadActionGenerator(SET_CURRENT_COMPANY);
export const setCompanies = payloadActionGenerator(SET_COMPANIES);
export const setFoundations = payloadActionGenerator(SET_FOUNDATIONS);
export const setGovernmentOrganizations = payloadActionGenerator(SET_GOVERNMENT_ORGANIZATIONS);

export const loadCompany = (identifier) => {
  return async (dispatch) => {
    const response = await fetch(`/company_info/${identifier}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setCurrentCompany(responseJson.company));

    return responseJson.company;
  }
}

export const fetchCompanies = () => {
  return async (dispatch) => {
    const response = await fetch(`/companies`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setCompanies(responseJson.companies));

    return responseJson.companies;
  }
}

export const fetchFoundations = () => {
  return async (dispatch) => {
    const response = await fetch(`/foundations`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setFoundations(responseJson.foundations));

    return responseJson.foundations;
  }
}

export const fetchGovernmentOrganizations = () => {
  return async (dispatch) => {
    const response = await fetch(`/government_organizations`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setGovernmentOrganizations(responseJson.government_organizations));

    return responseJson.government_organizations;
  }
}

export const toggleRFP = (id) => {
  return async (dispatch) => {
    dispatch(startToggleRFP({ id }));

    const formData = new FormData();
    formData.append('rfp_id', id);

    try {
      const rfpResponse = await fetch('/toggle_rfp', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await rfpResponse.json();

      dispatch(finishToggleRFP({
        id,
        enabled: responseJson.enabled,
      }));
    } catch(err) {
      dispatch(finishToggleRFP({
        id,
        enabled: responseJson.enabled,
      }));
    }
  };
};

export const saveRFP = (id) => {
  return async (dispatch) => {
    dispatch(startSaveUnsaveRFP({ id }));

    const formData = new FormData();
    formData.append('rfp_id', id);

    try {
      const rfpResponse = await fetch('/save_rfp', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await rfpResponse.json();

      dispatch(finishSaveUnsaveRFP({
        id,
        saved: true,
      }));
    } catch(err) {
      dispatch(finishSaveUnsaveRFP({
        id,
        saved: false,
      }));
    }
  };
};

export const unsaveRFP = (id) => {
  return async (dispatch) => {
    dispatch(startSaveUnsaveRFP({ id }));

    const formData = new FormData();
    formData.append('rfp_id', id);

    try {
      const rfpResponse = await fetch('/unsave_rfp', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await rfpResponse.json();

      dispatch(finishSaveUnsaveRFP({
        id,
        saved: false,
      }));
    } catch(err) {
      dispatch(finishSaveUnsaveRFP({
        id,
        saved: true,
      }));
    }
  };
};

export const followCompany = (id) => {
  return async (dispatch) => {
    dispatch(startFollowUnfollowCompany({ id }));

    const formData = new FormData();
    formData.append('company_id', id);

    try {
      const companyResponse = await fetch('/follow_company', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await companyResponse.json();

      dispatch(finishFollowUnfollowCompany({
        id,
        saved: true,
      }));
    } catch(err) {
      dispatch(finishFollowUnfollowCompany({
        id,
        saved: false,
      }));
    }
  };
};

export const unfollowCompany = (id) => {
  return async (dispatch) => {
    dispatch(startFollowUnfollowCompany({ id }));

    const formData = new FormData();
    formData.append('company_id', id);

    try {
      const companyResponse = await fetch('/unfollow_company', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await companyResponse.json();

      dispatch(finishFollowUnfollowCompany({
        id,
        saved: false,
      }));
    } catch(err) {
      dispatch(finishFollowUnfollowCompany({
        id,
        saved: true,
      }));
    }
  };
};
