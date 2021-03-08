import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import moment from 'moment';
import { Container, Grid, Tab, Menu, Button, Checkbox, Dropdown } from 'semantic-ui-react';

import { COLORS, PROPOSAL_STATUSES, WINDOW_DIMENSIONS } from '../../../../constants';
import {
  fetchUser as fetchUserAction,
} from '../../actions/profileActions';
import {
  fetchRequestForProposals as fetchRequestForProposalsAction,
  fetchProposals as fetchProposalsAction,
  setReviewerDashboardRFP as setReviewerDashboardRFPAction,
} from '../../actions/companyActions';
import {
  toggleRFP as toggleRFPAction,
} from '../../actions/defaultActions';
import InviteFacultyModal from '../RFPPage/InviteFacultyModal';

import haloLogo from '../../../../images/logos/halo_logo.svg';

const { TABLET_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  ReviewerDashboard_mainPanes: {
    marginTop: '35px',
  },
  ReviewerDashboard_menuItem: {
    fontSize: '14px',
    paddingLeft: '40px',
    paddingRight: '40px',
  },
  ReviewerDashboard_tabMenu: {

  },
  ReviewerDashboard_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  ReviewerDashboard_aboutText: {
    fontSize: '13px',
    marginBottom: '60px',
    color: COLORS.lightBlack,
    width: '75%',
  },
  ReviewerDashboard_addButton: {
    fontSize: '14px',
    padding: '10px 35px',
    borderRadius: '4px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
  },
  ReviewerDashboard_rightAlign: {
    textAlign: 'right',
  },
  ReviewerDashboard_emptyState: {
    color: COLORS.lightBlack,
    marginTop: '100px',
    textAlign: 'center',
    fontSize: '20px',
  },
  ReviewerDashboard_header: {
    fontSize: '24px',
    fontWeight: 600,
  },
  ReviewerDashboard_actionButton: {
    padding: '12px 30px',
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.haloBlue}`,
    color: COLORS.haloBlue,
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    width: '195px',
  },
  ReviewerDashboard_newRFPButton: {
    padding: '15px 42px',
    backgroundColor: COLORS.haloBlue,
    color: COLORS.white,
    fontSize: '16px',
    fontWeight: 500,
    borderRadius: '8px',
    width: '150px',
    right: '0px',
    position: 'absolute',
  },
  ReviewerDashboard_actionHeader: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '20px',
  },
  ReviewerDashboard_actionDescription: {
    fontSize: '14px',
    marginBottom: '20px',
  },
  ReviewerDashboard_actionSection: {
    width: '33%',
    padding: '0 30px',
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'top',
    [TABLET_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  ReviewerDashboard_rfpHeader: {
    display: 'flex',
    marginTop: '80px',
    marginBottom: '20px',
    position: 'relative',
    width: '100%',
  },
  ReviewerDashboard_rfpTitleHeader: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: '45px',
  },
  ReviewerDashboard_rfpLink: {
    color: COLORS.haloBlack,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    ':hover': {
      textDecoration: 'underline',
      color: COLORS.haloBlue,
    },
  },
  ReviewerDashboard_rfpToggle: {
    position: 'absolute',
    right: '25px',
    top: '0px',
  },
  ReviewerDashboard_rfpCounts: {
    display: 'flex',
  },
  ReviewerDashboard_rfpCountColumn: {
    textAlign: 'center',
    width: '16.5%',
    [TABLET_MEDIA_QUERY]: {
      width: '33%',
    },
  },
  ReviewerDashboard_rfpCountValue: {
    color: COLORS.haloBlack,
    fontSize: '22px',
  },
  ReviewerDashboard_rfpCountLabel: {
    color: COLORS.haloBlack,
    fontSize: '14px',
    ':hover': {
      textDecoration: 'none',
      color: COLORS.blue,
      cursor: 'pointer'
    }

  },
  ReviewerDashboard_inlineItem: {
    display: 'inline-block',
    margin: '30px',
    fontSize: '14px',
    lineHeight: '16px',
    color: COLORS.lightBlack,
  },
  ReviewerDashboard_regularLink: {
    textDecoration: 'none',
    color: COLORS.lightBlack,
    cursor: 'pointer',
  },
  ReviewerDashboard_activeLink: {
    textDecoration: 'none',
    color: COLORS.haloBlue,
    cursor: 'pointer',
  },
  ReviewerDashboard_leftMenu: {
    width: '100%',
    float: 'left',
    display: 'inline-block',
    textAlign: 'left',
    marginBottom: '60px',
  },
  ReviewerDashboard_offText: {
    position: 'absolute',
    right: '29px',
    fontSize: '8px',
    top: '11px',
  },
  ReviewerDashboard_onText: {
    position: 'absolute',
    right: '43px',
    fontSize: '8px',
    top: '11px',
    color: COLORS.white,
    zIndex: 5,
  },
  ReviewerDashboard_optionDropdown: {
    right: '0px',
    top: '0px',
    position: 'absolute',
  },
});

class ReviewerDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      inviteRFP: undefined,
      inviteFacultyModalOpen: false,
    };
  }

  async componentWillMount() {
    const {
      fetchRequestForProposals,
      fetchProposals,
      fetchUser,
      setReviewerDashboardRFP,
    } = this.props;

    const currentUserId = gon.current_user.id;

    const currentUser = await fetchUser(currentUserId);

    if (currentUser.company) {
      const rfps = await fetchRequestForProposals(currentUser.company.id);

      if (rfps.length > 0) {
        await fetchProposals(rfps[0].id);
        setReviewerDashboardRFP(rfps[0]);
      } else {
        setReviewerDashboardRFP({});
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      reviewerDashboardRFP,
      fetchProposals,
    } = this.props;

    if (prevProps.reviewerDashboardRFP !== reviewerDashboardRFP) {
      await fetchProposals(reviewerDashboardRFP.id);
    }
  }

  handleTabClick = (index) => {
    this.setState({ activeTabIndex: index });
  }

  handleRFPToggle = async (e, data, rfpId) => {
    const {
      currentUser,
      toggleRFP,
      fetchRequestForProposals,
    } = this.props;

    await toggleRFP(rfpId);

    await fetchRequestForProposals(currentUser.company.id);
  }

  onRFPLabelClick(rfp, statusFilter) {
    window.location.href = `/reviewer_dashboard/proposals?status=${statusFilter}&rfp=${rfp.identifier}`;
  }

  renderRfpCountColumn(rfp, statusFilter, displayText) {
    const countKey = statusFilter ? 'proposal_' + statusFilter + '_count' : 'proposal_count';
    return (
      <div className={css(styles.ReviewerDashboard_rfpCountColumn)}>
        <div className={css(styles.ReviewerDashboard_rfpCountValue)}>{rfp[countKey]}</div>
        <a onClick={() => this.onRFPLabelClick(rfp, statusFilter)} className={css(styles.ReviewerDashboard_rfpCountLabel)}>{displayText}</a>
      </div>
    );
  }

  render() {
    const {
      currentUser,
      reviewerDashboardRFP,
      requestForProposals,
      location,
    } = this.props;
    const {
      activeTabIndex,
      inviteRFP,
      inviteFacultyModalOpen,
    } = this.state;

    const isReviewDashboardProposals = location.pathname.startsWith("/reviewer_dashboard/proposals");

    if (!gon.current_user) {
      window.location.href = "/login";
    } else {
      return (
        <>
          <InviteFacultyModal
            showRFPName
            requestForProposal={inviteRFP}
            open={inviteFacultyModalOpen}
            closeInviteFacultyModal={() => { this.setState({ inviteFacultyModalOpen: false }) }}
          />
          <div className={css(styles.ReviewerDashboard_leftMenu)}>
            <div className={css(styles.ReviewerDashboard_inlineItem)}>
              <a href="/"><img src={haloLogo} alt='halo-logo' /></a>
            </div>
            <div className={css(styles.ReviewerDashboard_inlineItem)}>
              <div
                onClick={() => window.location.href="/reviewer_dashboard"}
                className={css(isReviewDashboardProposals ? styles.ReviewerDashboard_regularLink : styles.ReviewerDashboard_activeLink)}
              >
                RFPs
              </div>
            </div>
            <div className={css(styles.ReviewerDashboard_inlineItem)}>
              <div
                onClick={() => window.location.href="/reviewer_dashboard/proposals"}
                className={css(isReviewDashboardProposals ? styles.ReviewerDashboard_activeLink : styles.ReviewerDashboard_regularLink)}
              >
                Proposals
              </div>
            </div>
          </div>
          <Container>
              {Object.keys(reviewerDashboardRFP).length > 0 ? (
                <>
                  <div className={css(styles.ReviewerDashboard_rfpHeader)}>
                    <div className={css(styles.ReviewerDashboard_sectionHeader)}>
                      RFPs
                    </div>
                    <Button
                        onClick={() => window.location.href="/request_for_proposals/new"}
                        className={css(styles.ReviewerDashboard_newRFPButton)}
                      >
                        Post RFP
                    </Button>
                  </div>
                  {requestForProposals.map((rfp) => {
                    return (
                      <div key={`rfp-${rfp.id}`}>
                        <hr />
                        <div className={css(styles.ReviewerDashboard_rfpTitleHeader)}>
                          <a className={css(styles.ReviewerDashboard_rfpLink)} href={`/reviewer_dashboard/proposals?rfp=${rfp.identifier}`}>
                            {rfp.title}
                          </a>
                          <div>
                            <div className={css(rfp.enabled ? styles.ReviewerDashboard_onText : styles.ReviewerDashboard_offText)}>{rfp.enabled ? 'On' : 'Off'}</div>
                            <Checkbox className={css(styles.ReviewerDashboard_rfpToggle)} toggle checked={rfp.enabled} onChange={(e, data) => this.handleRFPToggle(e, data, rfp.id)}/>
                            <Dropdown
                              direction='left'
                              className={css(styles.ReviewerDashboard_optionDropdown)}
                              icon='chevron down'
                            >
                              <Dropdown.Menu>
                                <Dropdown.Item text='View RFP' onClick={() => window.location.href = `/research/${rfp.research_area}/${rfp.identifier}`}/>
                                <Dropdown.Item
                                  text='Invite Reviewer'
                                  onClick={() => {
                                    this.setState({
                                      inviteRFP: rfp,
                                      inviteFacultyModalOpen: true,
                                    });
                                  }}
                                />
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>

                        <div className={css(styles.ReviewerDashboard_rfpCounts)}>
                          {this.renderRfpCountColumn(rfp, '', 'Total')}
                          {this.renderRfpCountColumn(rfp, 'open', 'Open')}
                          {this.renderRfpCountColumn(rfp, 'qualified', 'Qualified')}
                          {this.renderRfpCountColumn(rfp, 'screened', 'Screened')}
                          {this.renderRfpCountColumn(rfp, 'declined', 'Declined')}
                        </div>
                      </div>
                    );
                  })}
                  <br />
                  <br />
                </>
              ) : (
                <div className={css(styles.ReviewerDashboard_emptyState)}>
                  <div className={css(styles.ReviewerDashboard_header)}>Welcome aboard!</div>
                  <br />
                  Halo makes it easy to post RFPs and manage proposals.
                  <br />
                  <hr />
                  <div>
                    <div className={css(styles.ReviewerDashboard_actionSection)}>
                      <div className={css(styles.ReviewerDashboard_actionHeader)}>Create an RFP</div>
                      <div className={css(styles.ReviewerDashboard_actionDescription)}>
                        Start by creating an RFP around a company interest.
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => window.location.href="/request_for_proposals/new"}
                          className={css(styles.ReviewerDashboard_actionButton)}
                        >
                          Create RFP
                        </Button>
                      </div>
                    </div>
                    <div className={css(styles.ReviewerDashboard_actionSection)}>
                      <div className={css(styles.ReviewerDashboard_actionHeader)}>Invite Reviewers</div>
                      <div className={css(styles.ReviewerDashboard_actionDescription)}>
                        Make the most of Halo by reviewing proposals with your team.
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => window.location.href="/request_for_proposals/new"}
                          className={css(styles.ReviewerDashboard_actionButton)}
                        >
                          Invite a team member
                        </Button>
                      </div>
                    </div>
                    <div className={css(styles.ReviewerDashboard_actionSection)}>
                      <div className={css(styles.ReviewerDashboard_actionHeader)}>Manage Proposals</div>
                      <div className={css(styles.ReviewerDashboard_actionDescription)}>
                        Manage and respond to incoming proposals for RFPs.
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => window.location.href="/reviewer_dashboard/proposals"}
                          className={css(styles.ReviewerDashboard_actionButton)}
                        >
                          Manage proposals
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </Container>
        </>
      );
    }
  }
}

ReviewerDashboard.defaultProps = {
  requestForProposals: [],
  proposals: [],
  currentUser: {},
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.profiles.currentUser,
    proposals: state.company.proposals,
    requestForProposals: state.company.requestForProposals,
    reviewerDashboardRFP: state.company.reviewerDashboardRFP,
  };
};

const mapDispatchToProps = {
  fetchRequestForProposals: fetchRequestForProposalsAction,
  fetchProposals: fetchProposalsAction,
  fetchUser: fetchUserAction,
  toggleRFP: toggleRFPAction,
  setReviewerDashboardRFP: setReviewerDashboardRFPAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewerDashboard);
