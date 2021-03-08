import React, { PureComponent } from 'react';

import SimpleAuthPage from '../SimpleAuthPage';

class LoginPage extends PureComponent {
  render() {
    return (
      <SimpleAuthPage
        isLogin
        switchLink={'/register'}
      />
    );
  }
}

export default LoginPage;
