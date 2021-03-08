import { WINDOW_DIMENSIONS } from '../../../constants';

const { MOBILE, TABLET, TABLET_LANDSCAPE } = WINDOW_DIMENSIONS;

export const UPDATE_WINDOW_DIMENSION = 'UPDATE_WINDOW_DIMENSION';
export const UPDATE_SCROLL_POSITION = 'UPDATE_SCROLL_POSITION';

const WINDOW_HEIGHT = window.outerHeight * 0.50;
const NAV_BAR_HEIGHT = 100;

export const calculateScrollPercent = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return (window.scrollY / scrollHeight) * 100;
}

export const updateWindowDimension = () =>
  (dispatch) =>
    dispatch({
      type: UPDATE_WINDOW_DIMENSION,
      payload: {
        width: window.outerWidth,
        height: window.outerHeight,
        isMobile: window.outerWidth <= MOBILE,
        isTablet: window.outerWidth <= TABLET,
        isTabletLandscape: window.outerWidth <= TABLET_LANDSCAPE,
      },
    });

export const updateScrollPosition = () =>
  (dispatch) =>
    dispatch({
      type: UPDATE_SCROLL_POSITION,
      payload: {
        scrollPercent: calculateScrollPercent(),
        shouldRevealStickyNavBar: window.scrollY >= NAV_BAR_HEIGHT,
        hasScrolledBelowFold: window.scrollY >= WINDOW_HEIGHT,
      },
    });
