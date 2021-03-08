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
  ComingSoonModal_dimmer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.white,
    opacity: '0.95',
    zIndex: 100,
    filter: 'blur(80px)',
    '-webkitFilter': 'blur(80px)',
  },
  ComingSoonModal_modal: {
    width: '480px',
    height: '455px',
  },
  ComingSoonModal_modalInput: {
    width: '100%',
    margin: '0px auto 24px',
    padding: '15px 10px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  ComingSoonModal_modalSubmitButton: {
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
  ComingSoonModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
  },
  ComingSoonModal_header: {
    fontSize: '18px',
    color: COLORS.lightBlack,
    textAlign: 'center',
    margin: '34px auto 14px',
  },
  ComingSoonModal_subheader: {
    fontSize: '14px',
    margin: '0px auto 40px',
    textAlign: 'center',
  },
  ComingSoonModal_smallText: {
    fontSize: '12px',
    textAlign: 'center',
    margin: '0px auto 15px',
  },
  ComingSoonModal_logo: {
    width: '82px',
    height: '14px',
  },
  ComingSoonModal_logoContainer: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  ComingSoonModal_boldFont: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: COLORS.lightBlack,
    textAlign: 'center',
  },
  ComingSoonModal_checkIcon: {
    textAlign: 'center',
    margin: '15px auto',
  },
});

const initialState = {
  email: '',
  isContacted: false,
}

class ComingSoonModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.open !== this.props.open) {
      this.setState(initialState);
    }
  }

  handleSubmit = async (e) => {
    const {
      requestForProposal,
      currentUser,
      isLoggedIn,
    } = this.props;

    e.preventDefault();

    const {
      email,
    } = this.state;

    this.setState({
      isContacted: true,
    });

    const formData = new FormData();
    formData.append('email', isLoggedIn ? currentUser.email : email);
    formData.append('request_for_proposal_id', requestForProposal.id);

    try {
      const response = await fetch('/request_for_proposals/waitlist', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await response.json();
    } catch(err) {
      this.setState({ isContacted: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  render() {
    const {
      open,
      requestForProposal,
      isLoggedIn,
    } = this.props;

    const {
      email,
      isContacted,
    } = this.state;

    return (
      <>
        {open && <div className={css(styles.ComingSoonModal_dimmer)} />}
        <Modal
          open={open}
          size="small"
          className={`${css(styles.ComingSoonModal_modal)} scrolling`}
        >
          <Modal.Content>
            <Container>
              <div className={css(styles.ComingSoonModal_header)}>Industry Call for Proposals</div>
              <div className={css(styles.ComingSoonModal_subheader)}>
                Innovative technologies for water purification, water sensing, and dialysis.
              </div>
              <div className={css(styles.ComingSoonModal_smallText)}>
                Industry Partner
              </div>
              <div className={css(styles.ComingSoonModal_logoContainer)}>
                <img className={css(styles.ComingSoonModal_logo)} src={baxterLogo} />
              </div>
              {isContacted ? (
                <>
                  <div className={css(styles.ComingSoonModal_boldFont)}>
                    All Set!
                  </div>
                  <div className={css(styles.ComingSoonModal_checkIcon)}>
                    <Icon name="check circle outline" size="huge" />
                  </div>
                  <div className={css(styles.ComingSoonModal_smallText)}>
                    You’ll receive an email when the program is live and your faculty can apply.
                  </div>
                </>
              ) : (
                <>
                  <div className={css(styles.ComingSoonModal_smallText)}>
                    Accepting proposals soon. Get notified when it’s live.
                  </div>
                  {!isLoggedIn &&
                    <div>
                      <input
                        className={css(styles.ComingSoonModal_modalInput)}
                        placeholder='Enter email'
                        value={email}
                        type="text"
                        onChange={(e) => this.handleChange(e, 'email')}
                      />
                    </div>
                  }
                  <div className={css(styles.ComingSoonModal_modalButtonHolder)}>
                    <Button
                      className={css(styles.ComingSoonModal_modalSubmitButton)}
                      type='submit'
                      onClick={this.handleSubmit}
                    >
                      Notify Me
                    </Button>
                  </div>
                </>
              )}
            </Container>
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

ComingSoonModal.propTypes = {
  requestForProposal: PropTypes.object,
  open: PropTypes.bool,
  closeComingSoonModal: PropTypes.func,
};

export default ComingSoonModal;
