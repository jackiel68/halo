import {
  emptyActionGenerator,
  payloadActionGenerator
} from '../utils/redux';
import { authenticityToken } from '../utils/requests';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOAD_CURRENT_USER = 'LOAD_CURRENT_USER';
export const SET_PATENTS = 'SET_PATENTS';
export const LOAD_PATENTS = 'LOAD_PATENTS';
export const SET_PUBLICATIONS = 'SET_PUBLICATIONS';
export const LOAD_PUBLICATIONS = 'LOAD_PUBLICATIONS';
export const SET_FUNDINGS = 'SET_FUNDINGS';
export const LOAD_FUNDINGS = 'LOAD_FUNDINGS';
export const TOGGLE_FUNDING_MODAL = 'TOGGLE_FUNDING_MODAL';
export const TOGGLE_PUBLICATION_MODAL = 'TOGGLE_PUBLICATION_MODAL';
export const TOGGLE_PATENT_MODAL = 'TOGGLE_PATENT_MODAL';
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';

export const setCurrentUser = payloadActionGenerator(SET_CURRENT_USER);
export const loadCurrentUser = emptyActionGenerator(LOAD_CURRENT_USER);
export const setPatents = payloadActionGenerator(SET_PATENTS);
export const loadPatents = emptyActionGenerator(LOAD_PATENTS);
export const setPublications = payloadActionGenerator(SET_PUBLICATIONS);
export const loadPublications = emptyActionGenerator(LOAD_PUBLICATIONS);
export const setFundings = payloadActionGenerator(SET_FUNDINGS);
export const loadFundings = emptyActionGenerator(LOAD_FUNDINGS);
export const toggleFundingModal = payloadActionGenerator(TOGGLE_FUNDING_MODAL);
export const togglePublicationModal = payloadActionGenerator(TOGGLE_PUBLICATION_MODAL);
export const togglePatentModal = payloadActionGenerator(TOGGLE_PATENT_MODAL);
export const toggleLoginModal = payloadActionGenerator(TOGGLE_LOGIN_MODAL);

export const fetchUser = (id) => {
  return async (dispatch) => {
    dispatch(loadCurrentUser());

    const response = await fetch(`/users/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      const responseJson = await response.json();

      dispatch(setCurrentUser(responseJson.user));
      return responseJson.user;
    } else {
      window.location = "/";
      return;
    }
  }
}

export const fetchPatents = (userId) => {
  return async (dispatch) => {
    dispatch(loadPatents());

    const response = await fetch(`/patents?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setPatents(responseJson.patents));

    return responseJson.patents;
  }
}

export const fetchPublications = (userId) => {
  return async (dispatch) => {
    dispatch(loadPublications());

    const response = await fetch(`/publications?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setPublications(responseJson.publications));

    return responseJson.publications;
  }
}

export const fetchFundings = (userId) => {
  return async (dispatch) => {
    dispatch(loadFundings());

    const response = await fetch(`/fundings?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    dispatch(setFundings(responseJson.fundings));

    return responseJson.fundings;
  }
}

