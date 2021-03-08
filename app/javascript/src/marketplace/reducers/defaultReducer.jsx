import {
  ADD_FILTER,
  REMOVE_FILTER,
  SEARCH_TERM,
  START_TOGGLE_RFP,
  FINISH_TOGGLE_RFP,
  START_SAVE_UNSAVE_RFP,
  FINISH_SAVE_UNSAVE_RFP,
  START_FOLLOW_UNFOLLOW_COMPANY,
  FINISH_FOLLOW_UNFOLLOW_COMPANY,
  INITIALIZE_SAVE_RFPS,
  INITIALIZE_FOLLOWED_COMPANIES,
  UPDATE_RESULT_LIST,
  UPDATE_CURRENT_RFP,
  SET_CURRENT_COMPANY,
  SET_COMPANIES,
  SET_FOUNDATIONS,
  SET_GOVERNMENT_ORGANIZATIONS,
}  from '../actions/defaultActions';

const initialState = {
  filters: {},
  searchTerm: "",
  isUpdatingSaveRFP: {},
  isUpdatingToggleRFP: {},
  savedRFPs: {},
  isUpdatingFollowedCompanies: {},
  followedCompanies: {},
  resultList: [],
  companies: [],
  foundations: [],
  government_organizations: [],
  currentCompany: {},
};

const defaultReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FILTER:
      const newFilters = state.filters[action.payload.filterType] || [];
      newFilters.push(action.payload.filterValue);
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterType]: Array.from(new Set(newFilters)),
        }
      };
    case REMOVE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterType]:
            state.filters[action.payload.filterType].filter(v => v !== action.payload.filterValue),
        }
      };
    case SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    case START_SAVE_UNSAVE_RFP:
      return {
        ...state,
        isUpdatingSaveRFP: {
          ...state.isUpdatingSaveRFP,
          [action.payload.id]: true,
        },
      };
    case FINISH_SAVE_UNSAVE_RFP:
      return {
        ...state,
        isUpdatingSaveRFP: {
          ...state.isUpdatingSaveRFP,
          [action.payload.id]: false,
        },
        savedRFPs: {
          ...state.savedRFPs,
          [action.payload.id]: action.payload.saved,
        },
      };
    case START_TOGGLE_RFP:
      return {
        ...state,
        isUpdatingToggleRFP: {
          ...state.isUpdatingToggleRFP,
          [action.payload.id]: true,
        },
      };
    case FINISH_TOGGLE_RFP:
      return {
        ...state,
        isUpdatingToggleRFP: {
          ...state.isUpdatingToggleRFP,
          [action.payload.id]: false,
        },
      };
    case INITIALIZE_SAVE_RFPS:
      return {
        ...state,
        savedRFPs: action.payload,
      };
    case START_FOLLOW_UNFOLLOW_COMPANY:
      return {
        ...state,
        isUpdatingFollowedCompanies: {
          ...state.isUpdatingFollowedCompanies,
          [action.payload.id]: true,
        },
      };
    case FINISH_FOLLOW_UNFOLLOW_COMPANY:
      return {
        ...state,
        isUpdatingFollowedCompanies: {
          ...state.isUpdatingFollowedCompanies,
          [action.payload.id]: false,
        },
        followedCompanies: {
          ...state.followedCompanies,
          [action.payload.id]: action.payload.saved,
        },
      };
    case INITIALIZE_FOLLOWED_COMPANIES:
      return {
        ...state,
        followedCompanies: action.payload,
      };
    case UPDATE_RESULT_LIST:
      return {
        ...state,
        resultList: action.payload,
      };
    case UPDATE_CURRENT_RFP:
      return {
        ...state,
        currentRFP: action.payload,
      };
    case SET_CURRENT_COMPANY:
      return {
        ...state,
        currentCompany: action.payload,
      };
    case SET_COMPANIES:
      return {
        ...state,
        companies: action.payload,
      };
    case SET_FOUNDATIONS:
      return {
        ...state,
        foundations: action.payload,
      };
    case SET_GOVERNMENT_ORGANIZATIONS:
      return {
        ...state,
        government_organizations: action.payload,
      };
    default:
      return state;
  }
};
export default defaultReducer;
