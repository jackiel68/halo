// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Loader } from 'semantic-ui-react';

import { store, persistor } from '../../src/marketplace/store';
import Marketplace from '../../src/marketplace/components/Marketplace';

const LoaderContainer = () => (
  <Container textAlign="center">
    <Loader />
  </Container>
);

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={<LoaderContainer />} persistor={persistor}>
      <Router onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/:filter?" component={withRouter(Marketplace)} />
      </Router>
    </PersistGate>
  </Provider>
);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root />,
    document.getElementById("full-container")
  )
})
