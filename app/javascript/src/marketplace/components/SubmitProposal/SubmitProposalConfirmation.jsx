import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Radio, Grid, Dropdown, Button, Icon, Modal, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';

import { COLORS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';

const styles = StyleSheet.create({
  SubmitProposalConfirmation_logoBanner: {
    textAlign: 'center',
    backgroundColor: COLORS.snowWhite,
    paddingTop: '15px',
    paddingBottom: '15px',
    marginBottom: '30px',
  },
  SubmitProposalConfirmation_container: {
    position: 'relative',
    marginBottom: '100px',
  },
  SubmitProposalConfirmation_endingBackground: {
    width: '100%',
  },
  SubmitProposalConfirmation_submissionContainer: {
    width: '60%',
    margin: '50px auto',
    textAlign: 'left',
  },
  SubmitProposalConfirmation_applicationSubmitted: {
    fontSize: '18px',
    lineHeight: '80px',
    color: COLORS.lightBlack,
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  SubmitProposalConfirmation_finalText: {
    fontSize: '14px',
    lineHeight: '28px',
    color: COLORS.lightBlack,
    marginBottom: '16px',
  },
  SubmitProposalConfirmation_finalButtonHolder: {
    textAlign: 'center',
    marginTop: '30px',
  },
  SubmitProposalConfirmation_goToProfileButton: {
    display: 'inline-block',
    padding: '18px 28px',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    color: COLORS.lightBlack,
    border: `1px solid ${COLORS.lightBlack}`,
    fontSize: '15px',
    marginRight: '30px',
  },
  SubmitProposalConfirmation_goToMarketplaceButton: {
    display: 'inline-block',
    padding: '18px 28px',
    backgroundColor: COLORS.pink,
    borderRadius: '4px',
    border: `1px solid ${COLORS.pink}`,
    color: COLORS.white,
    fontSize: '15px',
  },
  SubmitProposalConfirmation_submissionBullet: {
    marginBottom: '30px',
    marginTop: '30px',
    display: 'flex',
  },
  SubmitProposalConfirmation_numberedBullet: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: '100%',
    textAlign: 'center',
    marginRight: '20px',
    color: COLORS.white,
    fontSize: '14px',
    width: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    height: '30px',
  },
  SubmitProposalConfirmation_bulletText: {
    color: COLORS.lightBlack,
    fontSize: '14px',
  },
});

const SUBMISSION_BULLETS = [
  'Your proposal is sent to the sponsor',
  'Sponsor reviews your proposal and profile',
  'Sponsor follows up with next steps or feedback',
];

class SubmitProposalConfirmation extends PureComponent {
  render() {
    return (
      <div>
        <div className={css(styles.SubmitProposalConfirmation_logoBanner)}>
          <a href="/"><img src={haloLogo} /></a>
        </div>

        <Container className={css(styles.SubmitProposalConfirmation_container)}>
          <div className={css(styles.SubmitProposalConfirmation_endingBackground)}>
            <div className={css(styles.SubmitProposalConfirmation_submissionContainer)}>
              <div className={css(styles.SubmitProposalConfirmation_applicationSubmitted)}>
                Congratulations! You’ve successfully submitted your proposals
              </div>
              <div className={css(styles.SubmitProposalConfirmation_finalText)}>
                Here’s what happens next:
              </div>
              {SUBMISSION_BULLETS.map((bullet, i) => {
                return (
                  <div className={css(styles.SubmitProposalConfirmation_submissionBullet)} key={`bullet-${i}`}>
                    <div className={css(styles.SubmitProposalConfirmation_numberedBullet)}>
                      {i+1}
                    </div>
                    <div className={css(styles.SubmitProposalConfirmation_bulletText)}>
                      {bullet}
                    </div>
                  </div>
                );
              })}
              <div className={css(styles.SubmitProposalConfirmation_finalText)}>
                Responses will be sent within 10 weeks. To check the current status of your proposal, contact hello@halocures.com
              </div>
              <div className={css(styles.SubmitProposalConfirmation_finalButtonHolder)}>
                <Button
                  className={css(styles.SubmitProposalConfirmation_goToProfileButton)}
                  onClick={() => { window.location = `/profile/${gon.current_user_profile_id}` }}
                >
                  Go to Profile
                </Button>
                <Button
                  className={css(styles.SubmitProposalConfirmation_goToMarketplaceButton)}
                  onClick={() => { window.location = "/marketplace" }}
                >
                  Go to Marketplace
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default SubmitProposalConfirmation;
