import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import { COLORS } from '../../../../constants';

import {
  updateWindowDimension as updateWindowDimensionAction,
  updateScrollPosition as updateScrollPositionAction,
} from '../../actions/windowDimensionsActions';

import Home from '../Home';
import RFPPage from '../RFPPage';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import CompanyPage from '../CompanyPage';
import ProfilePage from '../ProfilePage';
import ReviewerDashboard from '../ReviewerDashboard';
import ProposalsDashboard from '../ProposalsDashboard';
import Account from '../Account';
import SubmitProposal from '../SubmitProposal';
import ResearchPage from '../ResearchPage';
import SubmitProposalConfirmation from '../SubmitProposal/SubmitProposalConfirmation';

const styles = StyleSheet.create({
  Marketplace_app: {
    display: 'flex',
    height: 'fit-content',
    minHeight: '1000px',
  },
  Marketplace_sideBar: {
    display: 'flex',
    minWidth: '330px',
    maxWidth: '330px',
    display: 'inline-block',
    backgroundColor: COLORS.snowWhite,
    borderRight: `1px solid ${COLORS.transparentGray}`,
  },
  Marketplace_mainContainer: {
    display: 'inline-block',
    position: 'relative',
    height: '100%',
  },
});

class Marketplace extends PureComponent {
  componentDidMount() {
    const {
      updateWindowDimension,
      updateScrollPosition,
    } = this.props;

    // Listen for window resizing, and update `windowDimension` in Redux
    window.addEventListener('resize', updateWindowDimension);
    window.addEventListener('scroll', updateScrollPosition);

    if (window.outerWidth > 0 && window.outerHeight > 0) {
      // Sometimes window hasn't fully loaded yet so we shouldn't set to 0 in those
      // cases
      updateWindowDimension();
    }
  }

  componentWillUnmount() {
    const { updateWindowDimension, updateScrollPosition } = this.props;
    window.removeEventListener('resize', updateWindowDimension);
    window.removeEventListener('scroll', updateScrollPosition);
  }

  render() {
    const {
      history,
      location,
    } = this.props;

    const noSidebar =
      location.pathname.startsWith("/submit_proposal/") ||
      location.pathname.startsWith("/marketplace/request_for_proposal/") ||
      location.pathname.startsWith("/research/") ||
      location.pathname.startsWith("/company/") ||
      location.pathname.startsWith("/reviewer_dashboard");
    const noNavbar =
      location.pathname.startsWith("/submit_proposal/");

    return (
      <div className={css(styles.Marketplace_app)}>
        {!noSidebar &&
          <div className={css(styles.Marketplace_sideBar)}>
            <div className={css(styles.Marketplace_logoBanner)}>
              <Sidebar path={location.pathname} />
            </div>
          </div>}
        <div
          className={css(styles.Marketplace_mainContainer)}
          style={{ width: noSidebar ? '100%' : '75%' }}
        >
          {!noNavbar && <Navbar noSidebar={noSidebar} path={location.pathname} />}
          <Switch>
            <Route exact path="/submit_proposal/:rfp_identifier/confirmation/:proposal_identifier" component={SubmitProposalConfirmation} />
            <Route exact path="/submit_proposal/:rfp_identifier" component={SubmitProposal} />
            <Route exact path="/marketplace" component={Home} />
            <Route exact path="/marketplace/request_for_proposal/:proposal" component={RFPPage} />
            <Route exact path="/company/:identifier" component={CompanyPage} />
            <Route exact path="/profile/:id" component={ProfilePage} />
            <Route exact path="/reviewer_dashboard/proposals" component={ProposalsDashboard} />
            <Route exact path="/reviewer_dashboard" component={ReviewerDashboard} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/research/:research_area/:proposal" component={RFPPage} />
            <Route exact path="/research/:research_area" component={ResearchPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateWindowDimension: updateWindowDimensionAction,
  updateScrollPosition: updateScrollPositionAction,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(Marketplace);
