import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { COLORS, PROPOSAL_STATUSES } from '../../../../constants';

const styles = StyleSheet.create({
  ProposalRow_resultContainer: {
    borderLeft: `1px solid ${COLORS.lightGray}`,
    borderRight: `1px solid ${COLORS.lightGray}`,
    padding: '16px 0px 16px 28px',
    position: 'relative',
    maxWidth: '250px',
    cursor: 'pointer',
  },
  ProposalRow_activeResultContainer: {
    borderLeft: `2px solid ${COLORS.haloBlue}`,
    backgroundColor: COLORS.haloGray,
  },
  ProposalRow_profilePic: {
    height: '48px',
    width: '48px',
    backgroundColor: COLORS.transparentDarkGray,
    borderRadius: '48px',
    position: 'absolute',
    left: '-70px',
    top: '0',
  },
  ProposalRow_rowHeader: {
    position: 'relative',
  },
  ProposalRow_userInfo: {

  },
  ProposalRow_userName: {
    color: COLORS.haloBlack,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '19px',
  },
  ProposalRow_userLocation: {
    color: COLORS.haloBlack,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '19px',
  },
  ProposalRow_timeAgo: {
    color: COLORS.dateGray,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '19px',
    marginTop: '6px',
  },
  ProposalRow_contactButton: {
    borderRadius: '4px',
    color: COLORS.white,
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    border: `1px solid ${COLORS.lightBlue}`,
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: '16px',
    fontWeight: 500,
    height: '40px',
  },
  ProposalRow_declineButton: {
    borderRadius: '4px',
    color: COLORS.darkGray,
    border: `1px solid ${COLORS.darkGray}`,
    backgroundColor: COLORS.snowWhite,
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '16px',
    fontWeight: 500,
    marginRight: '15px',
    height: '40px',
  },
  ProposalRow_link: {
    textDecoration: 'none',
  },
  ProposalRow_shareButton: {
    marginRight: '15px',
    cursor: 'pointer',
  },
});

class ProposalRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    const {
      proposal,
      onClickProposal,
      active,
    } = this.props;
    const {
      expanded,
    } = this.state;

    return (
      <div
        className={css(styles.ProposalRow_resultContainer, active && styles.ProposalRow_activeResultContainer)}
        onClick={() => {
          onClickProposal(proposal);
        }}
      >
        <div className={css(styles.ProposalRow_rowHeader)}>
          <div className={css(styles.ProposalRow_userInfo)}>
            <div className={css(styles.ProposalRow_userName)}>
              {`${proposal.user.first_name} ${proposal.user.last_name}`}
              <span>{proposal.user.educations && proposal.user.educations.map(e => e.degree).includes('PhD') && ', PhD'}</span>
            </div>
            <div className={css(styles.ProposalRow_userLocation)}>
              {proposal.user.profile_info && proposal.user.profile_info.location}
            </div>
            <div className={css(styles.ProposalRow_timeAgo)}>
              {moment(proposal.created_at).fromNow()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProposalRow.propTypes = {
  proposal: PropTypes.object.isRequired,
};

export default ProposalRow;
