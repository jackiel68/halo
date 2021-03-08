import React from 'react';
import AuthPage from '../../../authPage/components/AuthPage'


const CompanyLoginPage = () => {
  const lineItems = [
    'Create an RFP in minutes and distribute globally.',
    'Review proposals and PI profiles through your company dashboard.',
    'Cultivate a network of researchers within your core areas of interest.',
  ];
  const loginHeadline = 'Discover tomorrow’s breakthroughs today';

  return (
    <AuthPage
      lineItems={lineItems}
      loginHeadline={loginHeadline}
      isLogin
      isCompany
      switchLink={'/partners/register'}
    />
  )
}

export default CompanyLoginPage;
