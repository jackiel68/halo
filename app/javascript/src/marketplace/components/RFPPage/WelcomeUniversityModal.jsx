import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Icon, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';
import baxterLogo from '../../../../images/logos/baxter.png';

const styles = StyleSheet.create({
  WelcomeUniversityModal_dimmer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.white,
    opacity: '0.5',
    zIndex: 999,
    filter: 'blur(200px)',
    '-webkitFilter': 'blur(200px)',
  },
  WelcomeUniversityModal_modal: {
    width: '480px',
    padding: '50px 0px',
  },
  WelcomeUniversityModal_modalInput: {
    width: '100%',
    margin: '0px auto 24px',
    padding: '15px 10px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  WelcomeUniversityModal_modalSubmitButton: {
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    display: 'inline-block',
    height: '48px',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '5px 50px',
    width: '100%',
    marginBottom: '15px',
  },
  WelcomeUniversityModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
  },
  WelcomeUniversityModal_header: {
    fontSize: '18px',
    color: COLORS.lightBlack,
    textAlign: 'center',
    margin: '0px auto 14px',
  },
  WelcomeUniversityModal_subheader: {
    fontSize: '14px',
    margin: '0px auto 40px',
    textAlign: 'center',
  },
  WelcomeUniversityModal_smallText: {
    fontSize: '12px',
    textAlign: 'center',
    margin: '0px auto 15px',
  },
  WelcomeUniversityModal_logo: {
    width: '100px',
    objectFit: 'cover',
  },
  WelcomeUniversityModal_logoContainer: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  WelcomeUniversityModal_boldFont: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: COLORS.lightBlack,
    textAlign: 'center',
  },
  WelcomeUniversityModal_checkIcon: {
    textAlign: 'center',
    margin: '15px auto',
  },
});

const initialState = {
  email: '',
  isContacted: false,
}

class WelcomeUniversityModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.open !== this.props.open) {
      this.setState(initialState);
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  render() {
    const {
      open,
      isLoggedIn,
      closeModal,
      universityName,
      requestForProposal,
    } = this.props;

    const {
      email,
      isContacted,
    } = this.state;

    return (
      <>
        {open && <div className={css(styles.WelcomeUniversityModal_dimmer)} />}
        <Modal
          open={open}
          size="small"
          className={`${css(styles.WelcomeUniversityModal_modal)} scrolling`}
        >
          <Modal.Content>
            <Container>
              <div className={css(styles.WelcomeUniversityModal_header)}>Welcome to Halo, {universityName.split('-').join(' ')}!</div>
              <div className={css(styles.WelcomeUniversityModal_subheader)}>
                This is a private invitation to review our current industry opportunities.
              </div>
              {requestForProposal &&
                <div className={css(styles.WelcomeUniversityModal_smallText)}>
                  Industry Sponsor
                </div>}
              <div className={css(styles.WelcomeUniversityModal_logoContainer)}>
                {requestForProposal && requestForProposal.company && requestForProposal.company.logo_url ? (
                  <img alt="company-logo" className={css(styles.WelcomeUniversityModal_logo)} src={requestForProposal.company.logo_url} />
                ) : (
                  <div style={{ margin: 'auto', fontSize: '18px', fontWeight: 600 }}>{((requestForProposal || {}).company || {}).company_name}</div>
                )}
              </div>
              <div className={css(styles.WelcomeUniversityModal_modalButtonHolder)}>
                <Button
                  className={css(styles.WelcomeUniversityModal_modalSubmitButton)}
                  type='submit'
                  onClick={closeModal}
                >
                  View Opportunities
                </Button>
              </div>
            </Container>
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

WelcomeUniversityModal.defaultProps = {
  universityName: '',
};

WelcomeUniversityModal.propTypes = {
  requestForProposal: PropTypes.object,
  open: PropTypes.bool,
  closeWelcomeUniversityModal: PropTypes.func,
};

export default WelcomeUniversityModal;
