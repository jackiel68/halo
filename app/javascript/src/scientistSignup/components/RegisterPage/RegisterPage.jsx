import React from 'react';

import AuthPage from '../../../authPage/components/AuthPage';

const RegisterPage = () => {
  const lineItems = [
    'Join a network of scientists and partners in search of opportunities to collaborate.',
    'Submit your research proposals and make a difference.',
    'Do more research, publish more papers, and show off your lab’s latest work.',
  ];
  const signupHeadline = 'Move Science Forward';

  return (
    <AuthPage
      lineItems={lineItems}
      signupHeadline={signupHeadline}
      isLogin={false}
      isScientist
      switchLink={'/login'}
    />
  )
}

export default RegisterPage;
