import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { intersection } from 'lodash';
import { css, StyleSheet } from 'aphrodite';
import _ from 'lodash';

import { COLORS } from '../../../../constants';
import ProposalRow from './ProposalRow';
import ProposalDetails from './ProposalDetails';
import ContactModal from './ContactModal';
import ShareModal from './ShareModal';

const styles = StyleSheet.create({
  ProposalList_noResultsText: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '30px',
  },
  ProposalList_resultRow: {
    textDecoration: 'none',
  },
  ProposalList_container: {
    display: 'flex',
  },
  ProposalList_listView: {
    width: '30%',
    paddingTop: '55px',
  },
  ProposalList_detailsView: {
    width: '60%',
    paddingTop: '55px',
  },
});

class ProposalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contactProposal: undefined,
      shareProposal: undefined,
      detailsProposal: (props.proposals || [])[0],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.detailsProposal && this.props.proposals.length > 0) ||
        (prevState.detailsProposal && !this.props.proposals.map((p) => p.id).includes(prevState.detailsProposal.id))) {
      this.setState({ detailsProposal: this.props.proposals[0] });
    }
  }

  contactProposer = (proposal, status) => {
    this.setState({
      contactProposal: proposal,
      contactStatus: status,
      contactModalOpen: true,
    });
  }

  closeContactModal = () => {
    this.setState({ contactModalOpen: false });
  }

  shareProposal = (proposal) => {
    this.setState({
      sharedProposal: proposal,
      shareModalOpen: true,
    });
  }

  onClickProposal = (proposal) => {
    this.setState({ detailsProposal: proposal });
  }

  closeShareModal = () => {
    this.setState({ shareModalOpen: false });
  }

  render() {
    const {
      proposals,
      fetchProposals,
      publications,
      fundings,
      patents,
      fetchPublications,
      fetchFundings,
      fetchPatents,
    } = this.props;
    const {
      contactProposal,
      contactModalOpen,
      contactStatus,
      sharedProposal,
      shareModalOpen,
      detailsProposal,
    } = this.state;

    return (
      <div>
        <ContactModal
          proposal={contactProposal}
          open={contactModalOpen}
          status={contactStatus}
          closeContactModal={this.closeContactModal}
          fetchProposals={fetchProposals}
        />

        <ShareModal
          proposal={sharedProposal}
          open={shareModalOpen}
          closeShareModal={this.closeShareModal}
        />

        {proposals.length === 0 ? (
          <div className={css(styles.ProposalList_noResultsText)}>
            No proposals of this type exist for this RFP
          </div>
        ) : (
          <div className={css(styles.ProposalList_container)}>
            <div className={css(styles.ProposalList_listView)}>
              {
                proposals.map((proposal, idx) => {
                  return (
                    <ProposalRow
                      key={`proposal-row-${proposal.id}`}
                      proposal={proposal}
                      onClickProposal={this.onClickProposal}
                      active={detailsProposal && proposal.id === detailsProposal.id}
                    />
                  );
                })
              }
            </div>
            <div className={css(styles.ProposalList_detailsView)}>
              <ProposalDetails
                proposal={detailsProposal || proposals[0]}
                contactProposer={this.contactProposer}
                shareProposal={this.shareProposal}
                fetchProposals={fetchProposals}
                fetchPublications={fetchPublications}
                fetchPatents={fetchPatents}
                fetchFundings={fetchFundings}
                fundings={fundings}
                publications={publications}
                patents={patents}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

ProposalList.propTypes = {
  proposals: PropTypes.arrayOf(PropTypes.object),
};

ProposalList.defaultProps = {
  proposals: [],
};

export default ProposalList;
