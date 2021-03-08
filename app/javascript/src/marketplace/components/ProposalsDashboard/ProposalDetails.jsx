import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import { Button, Icon, Tab, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  authenticityToken,
} from '../../utils/requests';

import { COLORS, PROPOSAL_STATUSES } from '../../../../constants';

import ProfileList from '../ProfilePage/ProfileList';

const styles = StyleSheet.create({
  ProposalDetails_resultContainer: {
    position: 'relative',
  },
  ProposalDetails_profilePic: {
    height: '48px',
    width: '48px',
    backgroundColor: COLORS.transparentDarkGray,
    borderRadius: '48px',
    position: 'absolute',
    left: '-70px',
    top: '0',
  },
  ProposalDetails_menuItem: {
    fontSize: '14px',
    paddingLeft: '40px',
    paddingRight: '40px',
    width: '33%',
    justifyContent: 'center',
    paddingBottom: '20px',
    marginTop: '25px',
  },
  ProposalDetails_profileMenuItem: {
    fontSize: '12px',
    paddingLeft: '20px',
    paddingRight: '40px',
    width: '25%',
    justifyContent: 'center',
    paddingBottom: '20px',
    marginTop: '35px',
  },
  ProposalDetails_rowHeader: {
    position: 'relative',
  },
  ProposalDetails_userInfo: {

  },
  ProposalDetails_userName: {
    color: COLORS.lightBlack,
    fontSize: '12px',
  },
  ProposalDetails_phdStatus: {
    color: COLORS.lightBlack,
    fontSize: '12px',
  },
  ProposalDetails_userTitle: {
    color: COLORS.subGray,
    fontSize: '12px',
  },
  ProposalDetails_userLocation: {
    color: COLORS.subGray,
    fontSize: '12px',
  },
  ProposalDetails_sectionHeader: {
    marginTop: '25px',
    marginBottom: '12px',
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
    color: COLORS.haloBlack,
  },
  ProposalDetails_sectionContent: {
    color: COLORS.haloBlack,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 300,
  },
  ProposalDetails_showMoreSection: {
    textAlign: 'left',
    position: 'absolute',
    width: '100%',
    left: '0',
    bottom: '-160px',
    marginBottom: '100px',
  },
  ProposalDetails_showMoreText: {
    color: COLORS.haloBlack,
    fontSize: '12px',
    cursor: 'pointer',
  },
  ProposalDetails_buttonContainer: {
    position: 'absolute',
    right: '-20px',
    top: '5px',
  },
  ProposalDetails_contactButton: {
    color: COLORS.haloBlack,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '5px',
    marginBottom: '20px',
    width: 'fit-content',
  },
  ProposalDetails_declineButton: {
    borderRadius: '4px',
    color: COLORS.darkGray,
    border: `1px solid ${COLORS.darkGray}`,
    backgroundColor: COLORS.snowWhite,
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '16px',
    fontWeight: 500,
    marginRight: '15px',
    padding: '5px 16px',
  },
  ProposalDetails_advanceButton: {
    borderRadius: '4px',
    color: COLORS.white,
    border: `1px solid ${COLORS.haloBlue}`,
    backgroundColor: COLORS.haloBlue,
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '16px',
    fontWeight: 500,
    marginRight: '15px',
    padding: '5px 16px',
  },
  ProposalDetails_link: {
    textDecoration: 'none',
  },
  ProposalDetails_shareButton: {
    marginRight: '15px',
    cursor: 'pointer',
  },
  ProposalDetails_tabMenu: {

  },
  ProposalDetails_discussionIntro: {
    textAlign: 'left',
    fontSize: '12px',
    color: COLORS.haloBlack,
    marginTop: '18px',
    fontWeight: 300,
  },
  ProposalDetails_discussionInput: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: COLORS.inputBorderGray,
    color: COLORS.darkGray,
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '20px',
    height: '48px',
    marginBottom: '15px',
    padding: '14px 16px',
    width: '100%',
    marginTop: '15px',
  },
  ProposalDetails_submissionForm: {

  },
  ProposalDetails_discussionButtonContainer: {
    width: '100%',
  },
  ProposalDetails_discussionShareButton: {
    color: COLORS.white,
    background: COLORS.haloBlue,
    fontSize: '12px',
    fontWeight: 500,
    padding: '4px 15px',
    borderRadius: '4px',
    width: 'fit-content',
    float: 'right',
    cursor: 'pointer',
  },
  ProposalDetails_messageHeader: {
    display: 'inline-flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  ProposalDetails_commentAuthor: {

  },
  ProposalDetails_messageOptions: {

  },
  ProposalDetails_messageContainer: {
    padding: '15px 15px 20px',
  },
  ProposalDetails_icon: {
    fontSize: '18px',
    cursor: 'pointer',
  },
  ProposalDetails_messageText: {
    textAlign: 'left',
    marginTop: '10px',
  },
});

class ProposalDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      activeTabIndex: 0,
      activeProfileTabIndex: 0,
      proposalDiscussions: [],
      discussionText: undefined,
    };
    if (props.proposal) {
      this.fetchProposalDiscussions(props.proposal.id)
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const {
      fetchPublications,
      fetchPatents,
      fetchFundings,
      proposal,
    } = this.props;

    if (prevProps.proposal.user.id !== proposal.user.id) {
      // await fetchPublications(proposal.user.id);
      // await fetchPatents(proposal.user.id);
      // await fetchFundings(proposal.user.id);
    }
    if (prevProps.proposal.id !== proposal.id) {
      await this.fetchProposalDiscussions(proposal.id);
    }
  }

  handleTabClick = (index) => {
    this.setState({ activeTabIndex: index });
  }

  handleProfileTabClick = (index) => {
    this.setState({ activeProfileTabIndex: index });
  }

  advanceProposal = async (proposal) => {
    const {
      fetchProposals,
    } = this.props;

    let newStatus = proposal.status;
    switch (proposal.status) {
      case PROPOSAL_STATUSES.PENDING:
        newStatus = PROPOSAL_STATUSES.QUALIFIED;
        break;
      case PROPOSAL_STATUSES.QUALIFIED:
        newStatus = PROPOSAL_STATUSES.SCREENED;
        break;
      default:
        break;
    };

    const formData = new FormData();
    formData.append('proposal_id', proposal.id);
    formData.append('status', newStatus);

    const proposalResponse = await fetch(`/proposals/${proposal.id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': authenticityToken(),
      }
    });
    const responseJson = await proposalResponse.json();
    if (responseJson.success) {
      await fetchProposals(proposal.request_for_proposal_id);
    }
  }

  fetchProposalDiscussions = async (proposalId) => {
    const response = await fetch(`/proposal_discussions?proposal_id=${proposalId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();

    this.setState({ proposalDiscussions: responseJson.proposal_discussions });
  }

  postProposalDiscussion = async () => {
    const { proposal } = this.props;
    const { discussionText } = this.state;

    const formData = new FormData();
    formData.append('proposal_id', proposal.id);
    formData.append('text', discussionText);

    const response = await fetch('/proposal_discussions', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': authenticityToken(),
      },
    });
    const responseJson = await response.json();

    await this.fetchProposalDiscussions(proposal.id);

    this.setState({ discussionText: undefined });
  }

  deleteProposalDiscussion = async (proposalId) => {
    if (confirm("Are you sure you want to delete that message?")) {
      const { proposal } = this.props;

      const formData = new FormData();
      formData.append('delete', true);

      const response = await fetch(`/proposal_discussions/${proposalId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        },
      });
      const responseJson = await response.json();

      await this.fetchProposalDiscussions(proposal.id);
    }
  }

  updateProposalDiscussion = async () => {
    const { proposal } = this.props;

    const formData = new FormData();
    formData.append('proposal_id', proposal.id);
    formData.append('text', discussionText);

    const response = await fetch('/proposal_discussions', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': authenticityToken(),
      },
    });
    const responseJson = await response.json();

    await this.fetchProposalDiscussions(proposal.id);

    this.setState({ discussionText: undefined });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getPanes = () => {
    const {
      proposal,
    } = this.props;
    const {
      expanded,
      activeProfileTabIndex,
      proposalDiscussions,
      discussionText,
    } = this.state;

    const panes = [];

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDetails_menuItem)} onClick={() => this.handleTabClick(0)} key="proposal">Proposal</Menu.Item>,
      render: () => {
        return (
          <div>
            <div className={css(styles.ProposalDetails_sectionHeader)}>
              Hypothesis
            </div>
            <div className={css(styles.ProposalDetails_sectionContent)}>
              {proposal.research_hypothesis}
            </div>
            <div className={css(styles.ProposalDetails_sectionHeader)}>
              Rationale
            </div>
            <div className={css(styles.ProposalDetails_sectionContent)}>
              {proposal.hypothesis_basis}
            </div>
            {expanded && (
              <>
                <div className={css(styles.ProposalDetails_sectionHeader)}>
                  Preliminary Data
                </div>
                <div className={css(styles.ProposalDetails_sectionContent)}>
                  {proposal.validation_procedure}
                </div>
                <div className={css(styles.ProposalDetails_sectionHeader)}>
                  Research Plan
                </div>
                <div className={css(styles.ProposalDetails_sectionContent)}>
                  {proposal.future_validation}
                </div>
              </>
            )}
            <div className={css(styles.ProposalDetails_showMoreSection)}>
              <div
                className={css(styles.ProposalDetails_showMoreText)}
                onClick={() => this.setState({ expanded: !this.state.expanded })}
              >
                {expanded ? "Hide Proposal" : "Full Proposal"} {expanded ? <Icon style={{ fontSize: '16px' }} name='chevron up' /> : <Icon style={{ fontSize: '16px' }} name='chevron down' />}
              </div>
            </div>
          </div>
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDetails_menuItem)} onClick={() => this.handleTabClick(1)} key="profile">Profile</Menu.Item>,
      render: () => {
        return (
          <Tab className={css(styles.ProposalDetails_tabMenu)} activeIndex={activeProfileTabIndex} menu={{ secondary: true, pointing: true }} panes={this.getProfilePanes()} />
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDetails_menuItem)} onClick={() => this.handleTabClick(2)} key="discussion">Discussion</Menu.Item>,
      render: () => {
        return (
          <div style={{ color: COLORS.haloBlack, fontSize: '12px', textAlign: 'center' }}>
            <div
              className={css(styles.ProposalDetails_discussionIntro)}
              style={{ marginBottom: proposalDiscussions.length === 0 ? '0px' : '15px' }}
            >
              Share feedback on the proposal with members of the review team
            </div>
            {proposalDiscussions.map((proposalDiscussion) => {
              const isUser = gon.current_user && gon.current_user.id === proposalDiscussion.user_id;
              return (
                <div
                  style={{ backgroundColor: isUser ? COLORS.commentBlue : COLORS.white }}
                  className={css(styles.ProposalDetails_messageContainer)}
                  key={`proposal-discussion-${proposalDiscussion.id}`}
                >
                  <div className={css(styles.ProposalDetails_messageHeader)}>
                    <div className={css(styles.ProposalDetails_commentAuthor)}>
                      <Icon className={css(styles.ProposalDetails_icon)} style={{ cursor: 'initial' }} name='comment outline' />
                      <b style={{ marginLeft: '8px', marginRight: '6px' }}>COMMENT POSTED</b> by {proposalDiscussion.user.first_name} {proposalDiscussion.user.last_name}
                    </div>
                    <div className={css(styles.ProposalDetails_messageOptions)}>
                      {isUser && <Icon className={css(styles.ProposalDetails_icon)} name='trash' onClick={() => this.deleteProposalDiscussion(proposalDiscussion.id)} />}
                      <span style={{ marginLeft: '8px' }}>{moment(proposalDiscussion.created_at).fromNow()}</span   >
                    </div>
                  </div>
                  <div className={css(styles.ProposalDetails_messageText)}>
                    {proposalDiscussion.text}
                  </div>
                </div>
              );
            })}
            <div className={css(styles.ProposalDetails_submissionForm)}>
              <input
                type="text"
                name="discussionText"
                className={css(styles.ProposalDetails_discussionInput)}
                value={discussionText}
                onChange={this.handleChange}
                placeholder={proposalDiscussions.length > 1 ? "Post a comment" : "Leave feedback"}
              />
              <div className={css(styles.ProposalDetails_discussionButtonContainer)}>
                <div className={css(styles.ProposalDetails_discussionShareButton)} onClick={this.postProposalDiscussion}>Share</div>
              </div>
            </div>
          </div>
        );
      },
    })

    return panes;
  };

  getProfilePanes = () => {
    const {
      fundings,
      publications,
      patents,
      proposal,
    } = this.props;

    const panes = [];

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDetails_profileMenuItem)} onClick={() => this.handleProfileTabClick(0)} key="publications">Publications ({proposal.publications.length})</Menu.Item>,
      render: () => {
        return (
          <div>
            <ProfileList itemName='Publications' items={proposal.publications.map((p) => {
                return {
                  header: p.title,
                  body: p.abstract,
                  url: p.url,
                  id: p.id,
                  footerElements: [p.date ? moment(p.date).format('MMMM YYYY') : 'No Date', p.publication_name],
                };
              })}
            />
          </div>
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDetails_profileMenuItem)} onClick={() => this.handleProfileTabClick(1)} key="fundings">Funding ({proposal.fundings.length})</Menu.Item>,
      render: () => {
        // Create our number formatter.
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });

        return (
          <div>
            <ProfileList itemName='Fundings' items={proposal.fundings.map((f) => {
                let header;
                if (f.sponsor) {
                  if (f.sponsor_type === 'foundation') {
                    header = `${f.sponsor.foundation_name} - ${f.title}`;
                  } else if (f.sponsor_type === 'government') {
                    header = `${f.sponsor.org_name} - ${f.title}`;
                  } else {
                    header = `${f.sponsor.company_name} - ${f.title}`;
                  }
                } else {
                  header = f.title;
                }
                return {
                  header,
                  body: f.description,
                  url: f.url,
                  id: f.id,
                  footerElements: [f.date ? moment(f.date).format('MMMM YYYY') : 'No Date', `${formatter.format(Number(f.amount)).split('.')[0]}`, (f.sponsor || {}).company_name],
                };
              })}
            />
          </div>
        );
      }
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalDetails_profileMenuItem)} onClick={() => this.handleProfileTabClick(2)} key="patents">Patents ({proposal.patents.length})</Menu.Item>,
      render: () => {
        return (
          <div>
            <ProfileList
              itemName='Patents'
              items={proposal.patents.map((p) => {
                const patentStatus = gon.patent_statuses.find(ps => ps.key === p.status);
                const statusText = 'Status: ' + (patentStatus ? patentStatus.text : 'None');
                const patentFilingDate = (p.filing_date ? 'Filing Date: ' + moment.utc(p.filing_date).format('MMMM DD, YYYY') : 'No Date');
                return {
                  header: p.title,
                  body: p.abstract,
                  url: p.url,
                  id: p.id,
                  footerElements: [patentFilingDate, null, statusText]
                };
              })}
            />
          </div>
        );
      }
    });

    return panes;
  };

  render() {
    const {
      proposal,
      contactProposer,
      shareProposal,
      advanceProposal,
    } = this.props;
    const { activeTabIndex } = this.state;

    return (
      <div className={css(styles.ProposalDetails_resultContainer)}>
        <div className={css(styles.ProposalDetails_rowHeader)}>
          <div className={css(styles.ProposalDetails_userInfo)}>
            <Link
              to={`/profile/${proposal.user.profile_id}`}
              className={css(styles.ProposalDetails_link)}
            >
              <div className={css(styles.ProposalDetails_userName)}>
                {`${proposal.user.first_name} ${proposal.user.last_name}`}
                <span className={css(styles.ProposalDetails_phdStatus)}>{proposal.user.educations && proposal.user.educations.map(e => e.degree).includes('PhD') && ', PhD'}</span>
              </div>
            </Link>
            <div className={css(styles.ProposalDetails_userTitle)}>
              {proposal.user.profile_info && proposal.user.profile_info.title}
            </div>
            <div className={css(styles.ProposalDetails_userLocation)}>
              {proposal.user.profile_info && proposal.user.profile_info.location}
            </div>
            <div
              className={css(styles.ProposalDetails_contactButton)}
              onClick={() => contactProposer(proposal, PROPOSAL_STATUSES.CONTACTED)}
            >
              <Icon name='mail outline' />&nbsp;<span>Contact</span>
            </div>
          </div>
          <div className={css(styles.ProposalDetails_buttonContainer)}>
            <Icon className={css(styles.ProposalDetails_shareButton)} name="share square" onClick={() => shareProposal(proposal)} />
            {proposal.status !== PROPOSAL_STATUSES.SCREENED && proposal.status !== PROPOSAL_STATUSES.DECLINED &&
              <Button
                className={css(styles.ProposalDetails_advanceButton)}
                onClick={() => this.advanceProposal(proposal)}
              >
                Advance
              </Button>
            }
            {proposal.status !== PROPOSAL_STATUSES.DECLINED &&
              <Button
                className={css(styles.ProposalDetails_declineButton)}
                onClick={() => contactProposer(proposal, PROPOSAL_STATUSES.DECLINED)}
              >
                Decline
              </Button>
            }
          </div>
        </div>
        {proposal.user.profile_info && proposal.user.profile_info.headline &&
          <div className={css(styles.ProposalDetails_sectionHeader)}>
            {proposal.user.profile_info.headline}
          </div>}
        {proposal.user.profile_info && proposal.user.profile_info.about &&
          <div className={css(styles.ProposalDetails_sectionContent)}>
            {proposal.user.profile_info.about}
          </div>}
        <Tab className={css(styles.ProposalDetails_tabMenu)} activeIndex={activeTabIndex} menu={{ secondary: true, pointing: true }} panes={this.getPanes()} />

      </div>
    );
  }
}

ProposalDetails.propTypes = {
  proposal: PropTypes.object.isRequired,
};

export default ProposalDetails;
