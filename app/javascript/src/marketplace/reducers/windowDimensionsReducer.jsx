import {
  UPDATE_WINDOW_DIMENSION,
  UPDATE_SCROLL_POSITION,
} from '../actions/windowDimensionsActions';

const initialState = {
  width: window.outerWidth,
  height: window.outerHeight,
  scrollPercent: 0,
};

export const windowDimensionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WINDOW_DIMENSION:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_SCROLL_POSITION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default windowDimensionReducer;
