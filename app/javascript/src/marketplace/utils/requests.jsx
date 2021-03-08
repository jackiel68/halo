export const authenticityToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]');
  if (token && (token instanceof window.HTMLMetaElement)) {
    return token.content;
  }
  return null;
};

export const getCookie = (name) => {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

export const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
