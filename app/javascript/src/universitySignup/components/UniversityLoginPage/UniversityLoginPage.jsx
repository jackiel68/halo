import React from 'react';
import AuthPage from '../../../authPage/components/AuthPage'


const UniversitySignupPage = () => {
  const lineItems = [
    'Develop new relationships with industry partners.',
    'Generate incremental research dollars to your institution.',
    'Help your investigators advance their research.',
  ];
  const loginHeadline = 'Welcome back! Log in to connect your faculty with sponsored research opportunities';

  return (
    <AuthPage
      lineItems={lineItems}
      loginHeadline={loginHeadline}
      isLogin
      switchLink={'/universities/register'}
    />
  )
}

export default UniversitySignupPage;
