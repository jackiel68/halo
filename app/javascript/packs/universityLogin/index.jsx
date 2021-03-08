import React from 'react';
import ReactDOM from 'react-dom';

import UniversityLoginPage from '../../src/universitySignup/components/UniversityLoginPage';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <UniversityLoginPage />,
    document.getElementById("full-container"),
  )
})
