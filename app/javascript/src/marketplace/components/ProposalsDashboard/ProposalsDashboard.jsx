import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import moment from 'moment';
import { Container, Dropdown, Grid, Tab, Menu, Button, Checkbox, Icon } from 'semantic-ui-react';

import { COLORS, PROPOSAL_STATUSES, WINDOW_DIMENSIONS } from '../../../../constants';
import {
  fetchUser as fetchUserAction,
  fetchPublications as fetchPublicationsAction,
  fetchPatents as fetchPatentsAction,
  fetchFundings as fetchFundingsAction,
} from '../../actions/profileActions';
import {
  fetchRequestForProposals as fetchRequestForProposalsAction,
  fetchProposals as fetchProposalsAction,
  setProposalDashboardRFP as setProposalDashboardRFPAction,
} from '../../actions/companyActions';
import {
  toggleRFP as toggleRFPAction,
} from '../../actions/defaultActions';

import ProposalList from './ProposalList';
import haloLogo from '../../../../images/logos/halo_logo.svg';

const { TABLET_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  ProposalDashboard_mainPanes: {
    marginTop: '35px',
  },
  ProposalDashboard_menuItem: {
    fontSize: '14px',
    paddingLeft: '40px',
    paddingRight: '40px',
    width: '20%',
    justifyContent: 'center',
  },
  ProposalDashboard_tabMenu: {

  },
  ProposalDashboard_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '24px',
    fontWeight: '600',
  },
  ProposalDashboard_aboutText: {
    fontSize: '13px',
    marginBottom: '60px',
    color: COLORS.lightBlack,
    width: '75%',
  },
  ProposalDashboard_addButton: {
    fontSize: '14px',
    padding: '10px 35px',
    borderRadius: '4px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
  },
  ProposalDashboard_rightAlign: {
    textAlign: 'right',
  },
  ProposalDashboard_emptyState: {
    color: COLORS.lightBlack,
    marginTop: '100px',
    textAlign: 'center',
    fontSize: '20px',
  },
  ProposalDashboard_header: {
    fontSize: '24px',
    fontWeight: 600,
  },
  ProposalDashboard_actionButton: {
    padding: '12px 30px',
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.haloBlue}`,
    color: COLORS.haloBlue,
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    width: '195px',
  },
  ProposalDashboard_newRFPButton: {
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
  ProposalDashboard_actionHeader: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '20px',
  },
  ProposalDashboard_actionDescription: {
    fontSize: '14px',
    marginBottom: '20px',
  },
  ProposalDashboard_actionSection: {
    width: '33%',
    padding: '0 30px',
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'top',
    [TABLET_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  ProposalDashboard_rfpHeader: {
    marginTop: '80px',
    marginBottom: '20px',
    position: 'relative',
    width: '100%',
  },
  ProposalDashboard_rfpTitleHeader: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: '45px',
  },
  ProposalDashboard_rfpLink: {
    color: COLORS.haloBlack,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 500,
    ':hover': {
      textDecoration: 'underline',
      color: COLORS.haloBlue,
    },
  },
  ProposalDashboard_rfpToggle: {
    position: 'absolute',
    right: '0px',
    top: '0px',
  },
  ProposalDashboard_rfpCounts: {
    display: 'flex',
  },
  ProposalDashboard_rfpCountColumn: {
    textAlign: 'center',
    width: '16.5%',
    [TABLET_MEDIA_QUERY]: {
      width: '33%',
    },
  },
  ProposalDashboard_rfpCountValue: {
    color: COLORS.haloBlack,
    fontSize: '22px',
  },
  ProposalDashboard_rfpCountLabel: {
    color: COLORS.haloBlack,
    fontSize: '14px',
  },
  ProposalDashboard_inlineItem: {
    display: 'inline-block',
    margin: '30px',
    fontSize: '14px',
    lineHeight: '16px',
    color: COLORS.lightBlack,
  },
  ProposalDashboard_regularLink: {
    textDecoration: 'none',
    color: COLORS.lightBlack,
    cursor: 'pointer',
  },
  ProposalDashboard_activeLink: {
    textDecoration: 'none',
    color: COLORS.haloBlue,
    cursor: 'pointer',
  },
  ProposalDashboard_leftMenu: {
    width: '100%',
    float: 'left',
    display: 'inline-block',
    textAlign: 'left',
    marginBottom: '60px',
  },
  ProposalDashboard_offText: {
    position: 'absolute',
    right: '4px',
    fontSize: '8px',
    top: '11px',
  },
  ProposalDashboard_onText: {
    position: 'absolute',
    right: '18px',
    fontSize: '8px',
    top: '11px',
    color: COLORS.white,
    zIndex: 5,
  },
  ProposalDashboard_sectionSubheader: {
    fontSize: '16px',
    color: COLORS.gray,
    marginBottom: '24px',
  },
  ProposalDashboard_iconDown: {
    color: COLORS.gray,
  },
  ProposalDashboard_dropdownItem: {
    height: '37px',
    display: 'flex',
    alignItems: 'center',
  },
});

const statusTabIndices = {
  all: 0,
  open: 1,
  qualified: 2,
  screened: 3,
  declined: 4
}

class ProposalDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      loading: false
    };
  }

  async componentWillMount() {
    const {
      fetchRequestForProposals,
      fetchProposals,
      fetchUser,
      setProposalDashboardRFP,
    } = this.props;

    const currentUserId = gon.current_user.id;
    const urlParams = new URLSearchParams(window.location.search);
    const rfpId = urlParams.get('rfp');
    const status = urlParams.get('status');
    const currentUser = await fetchUser(currentUserId);

    this.setState({loading: true})

    if (currentUser.company) {
      const rfps = await fetchRequestForProposals(currentUser.company.id);

      if (rfps.length > 0) {
        if (rfpId) {
          setProposalDashboardRFP(rfps.filter(rfp => rfp.identifier === rfpId)[0]);
        } else {
          await fetchProposals(rfps[0].id);
          setProposalDashboardRFP(rfps[0]);
        }
      } else {
        setProposalDashboardRFP({});
      }
    }

    if (status) {
      this.setState({activeTabIndex: statusTabIndices[status]})
    }

    this.setState({loading: false})
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      proposalDashboardRFP,
      fetchProposals,
    } = this.props;

    if (prevProps.proposalDashboardRFP !== proposalDashboardRFP) {
      await fetchProposals(proposalDashboardRFP.id);
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
      setProposalDashboardRFP,
    } = this.props;
    const {
      proposalDashboardRFP,
    } = this.state;

    await toggleRFP(rfpId);

    const rfps = await fetchRequestForProposals(currentUser.company.id);
    setProposalDashboardRFP(rfps.filter((rfp) => rfp.id === rfpId)[0]);
  }

  getPanes = () => {
    const {
      requestForProposals,
      proposals,
      fetchProposals,
      publications,
      fundings,
      patents,
      fetchPublications,
      fetchFundings,
      fetchPatents,
    } = this.props;

    const panes = [];

    const openProposals = _.filter(proposals, (proposal) => proposal.status === PROPOSAL_STATUSES.PENDING);
    const qualifiedProposals = _.filter(proposals, (proposal) => proposal.status === PROPOSAL_STATUSES.QUALIFIED);
    const screenedProposals = _.filter(proposals, (proposal) => proposal.status === PROPOSAL_STATUSES.SCREENED || proposal.status === PROPOSAL_STATUSES.CONTACTED);
    const declinedProposals = _.filter(proposals, (proposal) => proposal.status === PROPOSAL_STATUSES.DECLINED);

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDashboard_menuItem)} onClick={() => this.handleTabClick(0)} key="all">All ({proposals.length})</Menu.Item>,
      render: () => {
        return (
          <ProposalList
            fetchProposals={fetchProposals}
            proposals={proposals}
            fetchPublications={fetchPublications}
            fetchPatents={fetchPatents}
            fetchFundings={fetchFundings}
            fundings={proposals.length > 0 ? fundings : []}
            publications={proposals.length > 0 ? publications : []}
            patents={proposals.length > 0 ? patents : []}
          />
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDashboard_menuItem)} onClick={() => this.handleTabClick(1)} key="open">Open ({openProposals.length})</Menu.Item>,
      render: () => {
        return (
          <ProposalList
            fetchProposals={fetchProposals}
            proposals={openProposals}
            fetchPublications={fetchPublications}
            fetchPatents={fetchPatents}
            fetchFundings={fetchFundings}
            fundings={openProposals.length > 0 ? fundings : []}
            publications={openProposals.length > 0 ? publications : []}
            patents={openProposals.length > 0 ? patents : []}
          />
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDashboard_menuItem)} onClick={() => this.handleTabClick(2)} key="qualified">Qualified ({qualifiedProposals.length})</Menu.Item>,
      render: () => {
        return (
          <ProposalList
            fetchProposals={fetchProposals}
            proposals={qualifiedProposals}
            fetchPublications={fetchPublications}
            fetchPatents={fetchPatents}
            fetchFundings={fetchFundings}
            fundings={qualifiedProposals.length > 0 ? fundings : []}
            publications={qualifiedProposals.length > 0 ? publications : []}
            patents={qualifiedProposals.length > 0 ? patents : []}
          />
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDashboard_menuItem)} onClick={() => this.handleTabClick(3)} key="screened">Screened ({screenedProposals.length})</Menu.Item>,
      render: () => {
        return (
          <ProposalList
            fetchProposals={fetchProposals}
            proposals={screenedProposals}
            fetchPublications={fetchPublications}
            fetchPatents={fetchPatents}
            fetchFundings={fetchFundings}
            fundings={screenedProposals.length > 0 ? fundings : []}
            publications={screenedProposals.length > 0 ? publications : []}
            patents={screenedProposals.length > 0 ? patents : []}
          />
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDashboard_menuItem)} onClick={() => this.handleTabClick(4)} key="declined">Declined ({declinedProposals.length})</Menu.Item>,
      render: () => {
        return (
          <ProposalList
            fetchProposals={fetchProposals}
            proposals={declinedProposals}
            fetchPublications={fetchPublications}
            fetchPatents={fetchPatents}
            fetchFundings={fetchFundings}
            fundings={declinedProposals.length > 0 ? fundings : []}
            publications={declinedProposals.length > 0 ? publications : []}
            patents={declinedProposals.length > 0 ? patents : []}
          />
        );
      }
    });

    return panes;
  };

  render() {
    const {loading} = this.state;

    if (loading) {
      return null;
    }

    const {
      currentUser,
      proposalDashboardRFP,
      requestForProposals,
      location,
      setProposalDashboardRFP,
    } = this.props;
    const {
      activeTabIndex,
    } = this.state;

    const isReviewDashboardProposals = location.pathname.startsWith("/reviewer_dashboard/proposals");

    if (!gon.current_user) {
      window.location.href = "/login";
    } else {
      return (
        <>
          <div className={css(styles.ProposalDashboard_leftMenu)}>
            <div className={css(styles.ProposalDashboard_inlineItem)}>
              <a href="/"><img src={haloLogo} alt='halo-logo' /></a>
            </div>
            <div className={css(styles.ProposalDashboard_inlineItem)}>
              <div
                onClick={() => window.location.href="/reviewer_dashboard"}
                className={css(isReviewDashboardProposals ? styles.ProposalDashboard_regularLink : styles.ProposalDashboard_activeLink)}
              >
                RFPs
              </div>
            </div>
            <div className={css(styles.ProposalDashboard_inlineItem)}>
              <div
                onClick={() => window.location.href="/reviewer_dashboard/proposals"}
                className={css(isReviewDashboardProposals ? styles.ProposalDashboard_activeLink : styles.ProposalDashboard_regularLink)}
              >
                Proposals
              </div>
            </div>
          </div>
          <Container>
              {proposalDashboardRFP && Object.keys(proposalDashboardRFP).length > 0 ? (
                <>
                  <div className={css(styles.ProposalDashboard_rfpHeader)}>
                    <div className={css(styles.ProposalDashboard_sectionHeader)}>
                      Proposals
                    </div>
                    <div>
                      <Dropdown
                        className={css(styles.ProposalDashboard_sectionSubheader)}
                        trigger={<span style={{ marginRight: '5px' }}>RFPs</span>}
                        icon='chevron down'
                      >
                        <Dropdown.Menu>
                          {requestForProposals.map((rfp) => {
                            return (
                              <Dropdown.Item
                                key={`rfp-${rfp.id}`}
                                className={css(styles.ProposalDashboard_dropdownItem)}
                                value={rfp.identifier}
                                onClick={(e, selection) => {
                                  window.location.search = `?rfp=${selection.value}`;
                                  setProposalDashboardRFP(requestForProposals.filter((r) => selection.value === r.identifier)[0]);
                                }}
                              >
                                {rfp.title} ({rfp.proposal_count})
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className={css(styles.ProposalDashboard_rfpTitleHeader)}>
                      <a className={css(styles.ProposalDashboard_rfpLink)} href={`/research/${proposalDashboardRFP.research_area}/${proposalDashboardRFP.identifier}`}>
                        {proposalDashboardRFP.title}
                      </a>
                      <div>
                        <div className={css(proposalDashboardRFP.enabled ? styles.ProposalDashboard_onText : styles.ProposalDashboard_offText)}>{proposalDashboardRFP.enabled ? 'On' : 'Off'}</div>
                        <Checkbox className={css(styles.ProposalDashboard_rfpToggle)} toggle checked={proposalDashboardRFP.enabled} onChange={(e, data) => this.handleRFPToggle(e, data, proposalDashboardRFP.id)}/>
                      </div>
                    </div>

                  </div>
                  <Tab className={css(styles.ProposalDashboard_tabMenu)} activeIndex={activeTabIndex} menu={{ secondary: true, pointing: true }} panes={this.getPanes()} />
                </>
              ) : (
                <div className={css(styles.ProposalDashboard_emptyState)}>
                  <div className={css(styles.ProposalDashboard_header)}>It’s like a black hole in here.</div>
                  <br />
                  Let's create some RFPs to get some proposals
                  <br />
                  <hr />
                  <div>
                    <div className={css(styles.ProposalDashboard_actionSection)}>
                      <div className={css(styles.ProposalDashboard_actionHeader)}>Create an RFP</div>
                      <div className={css(styles.ProposalDashboard_actionDescription)}>
                        Start by creating an RFP around a company interest.
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => window.location.href="/request_for_proposals/new"}
                          className={css(styles.ProposalDashboard_actionButton)}
                        >
                          Create RFP
                        </Button>
                      </div>
                    </div>
                    <div className={css(styles.ProposalDashboard_actionSection)}>
                      <div className={css(styles.ProposalDashboard_actionHeader)}>Invite Reviewers</div>
                      <div className={css(styles.ProposalDashboard_actionDescription)}>
                        Make the most of Halo by reviewing proposals with your team.
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          disabled
                          onClick={() => window.location.href="/request_for_proposals/new"}
                          className={css(styles.ProposalDashboard_actionButton)}
                        >
                          Invite a team member (Coming Soon!)
                        </Button>
                      </div>
                    </div>
                    <div className={css(styles.ProposalDashboard_actionSection)}>
                      <div className={css(styles.ProposalDashboard_actionHeader)}>Manage Proposals</div>
                      <div className={css(styles.ProposalDashboard_actionDescription)}>
                        Manage and respond to incoming proposals for RFPs.
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => window.location.href="/reviewer_dashboard/proposals"}
                          className={css(styles.ProposalDashboard_actionButton)}
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

ProposalDashboard.defaultProps = {
  requestForProposals: [],
  proposals: [],
  currentUser: {},
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.profiles.currentUser,
    proposals: state.company.proposals,
    requestForProposals: state.company.requestForProposals,
    proposalDashboardRFP: state.company.proposalDashboardRFP,
    fundings: state.profiles.fundings,
    publications: state.profiles.publications,
    patents: state.profiles.patents,
  };
};

const mapDispatchToProps = {
  fetchRequestForProposals: fetchRequestForProposalsAction,
  fetchProposals: fetchProposalsAction,
  fetchUser: fetchUserAction,
  toggleRFP: toggleRFPAction,
  setProposalDashboardRFP: setProposalDashboardRFPAction,
  fetchPublications: fetchPublicationsAction,
  fetchPatents: fetchPatentsAction,
  fetchFundings: fetchFundingsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProposalDashboard);
