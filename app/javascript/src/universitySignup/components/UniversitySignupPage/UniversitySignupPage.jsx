import React from 'react';
import AuthPage from '../../../authPage/components/AuthPage'


const UniversitySignupPage = () => {
  const lineItems = [
    'Develop new relationships with industry partners.',
    'Generate incremental research dollars to your institution.',
    'Help your investigators advance their research.',
  ];
  const signupHeadline = 'Connect your faculty with industry-sponsored research';

  return (
    <AuthPage
      lineItems={lineItems}
      signupHeadline={signupHeadline}
      isLogin={false}
      isUniversity
      switchLink={'/universities/login'}
    />
  )
}

export default UniversitySignupPage;
