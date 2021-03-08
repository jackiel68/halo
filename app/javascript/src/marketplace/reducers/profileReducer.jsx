import {
  SET_CURRENT_USER,
  LOAD_CURRENT_USER,
  SET_PATENTS,
  LOAD_PATENTS,
  SET_PUBLICATIONS,
  LOAD_PUBLICATIONS,
  SET_FUNDINGS,
  LOAD_FUNDINGS,
  TOGGLE_FUNDING_MODAL,
  TOGGLE_PUBLICATION_MODAL,
  TOGGLE_PATENT_MODAL,
  TOGGLE_LOGIN_MODAL,
}  from '../actions/profileActions';

const initialState = {
  currentUser: {},
  loadingCurrentUser: false,
  loadingPatents: false,
  loadingPublications: false,
  loadingFundings: false,
  fundingModalOpen: false,
  publicationModalOpen: false,
  patentModalOpen: false,
  loginModalOpen: false,
  currentPatentId: null,
  currentPublicationId: null,
  currentFundingId: null,
  patents: [],
  publications: [],
  fundings: [],
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        loadingCurrentUser: false,
      }
    case LOAD_CURRENT_USER:
      return {
        ...state,
        loadingCurrentUser: true,
      };
    case SET_PUBLICATIONS:
      return {
        ...state,
        publications: action.payload,
        loadingPublications: false,
      }
    case LOAD_PUBLICATIONS:
      return {
        ...state,
        loadingPublications: true,
      };
    case SET_PATENTS:
      return {
        ...state,
        patents: action.payload,
        loadingPatents: false,
      }
    case LOAD_PATENTS:
      return {
        ...state,
        loadingPatents: true,
      };
    case SET_FUNDINGS:
      return {
        ...state,
        fundings: action.payload,
        loadingFundings: false,
      }
    case LOAD_FUNDINGS:
      return {
        ...state,
        loadingFundings: true,
      };
    case TOGGLE_FUNDING_MODAL:
      return {
        ...state,
        fundingModalOpen: action.payload,
        currentFundingId: (action.payload.open ? action.payload.currentFundingId : null)
      };
    case TOGGLE_PUBLICATION_MODAL:
      return {
        ...state,
        publicationModalOpen: action.payload,
        currentPublicationId: (action.payload.open ? action.payload.currentPublicationId : null)
      };
    case TOGGLE_PATENT_MODAL:
      return {
        ...state,
        patentModalOpen: action.payload.open,
        currentPatentId: (action.payload.open ? action.payload.currentPatentId : null)
      };
    case TOGGLE_LOGIN_MODAL:
      return {
        ...state,
        loginModalOpen: action.payload,
      };
    default:
      return state;
  }
};
export default profileReducer;
