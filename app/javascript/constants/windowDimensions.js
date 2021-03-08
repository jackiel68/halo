/* WINDOW DIMENSIONS */
const DESKTOP = 1199;
const TABLET_LANDSCAPE = 991;
const TABLET = 767;
const MOBILE = 479;
/* MEDIA QUERIES */
const LARGE_MEDIA_QUERY = `@media screen and (min-width: ${DESKTOP + 1}px)`;
const DESKTOP_MEDIA_QUERY = `@media screen and (max-width: ${DESKTOP}px)`;
const TABLET_LANDSCAPE_MEDIA_QUERY = `@media screen and (max-width: ${TABLET_LANDSCAPE}px)`;
const TABLET_MEDIA_QUERY = `@media screen and (max-width: ${TABLET}px)`;
const MOBILE_MEDIA_QUERY = `@media screen and (max-width: ${MOBILE}px)`;

export default {
  DESKTOP,
  TABLET_LANDSCAPE,
  TABLET,
  MOBILE,
  LARGE_MEDIA_QUERY,
  DESKTOP_MEDIA_QUERY,
  TABLET_LANDSCAPE_MEDIA_QUERY,
  TABLET_MEDIA_QUERY,
  MOBILE_MEDIA_QUERY,
}
