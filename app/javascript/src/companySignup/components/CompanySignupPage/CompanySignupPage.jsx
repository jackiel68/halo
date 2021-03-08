import React from 'react';
import AuthPage from '../../../authPage/components/AuthPage'

const CompanySignupPage = () => {
  const lineItems = [
    'Create an RFP in minutes and distribute globally.',
    'Review proposals and PI profiles through your company dashboard.',
    'Cultivate a network of researchers within your core areas of interest.',
  ];
  const signupHeadline = 'Discover tomorrow’s breakthroughs today';

  return (
    <AuthPage
      lineItems={lineItems}
      signupHeadline={signupHeadline}
      isLogin={false}
      isCompany
      switchLink={'/partners/login'}
    />
  )
}

export default CompanySignupPage;
