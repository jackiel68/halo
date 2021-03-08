import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  InviteFacultyModal_modal: {
    width: '380px',
    fontFamily: "Avenir",
  },
  InviteFacultyModal_content: {
    padding: '2em 1.5em'
  },
  InviteFacultyModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  InviteFacultyModal_modalInput: {
    width: '100%',
    margin: '0px auto 5px',
    padding: '16px',
    fontSize: '12px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '12px',
  },
  InviteFacultyModal_modalSubmitButton: {
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
    width: '100%'
  },
  InviteFacultyModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '24px',
  },
  InviteFacultyModal_header: {
    fontSize: '20px',
    fontWeight: '600',
    color: COLORS.lightBlack,
    textAlign: 'center',
    margin: '0 auto 14px',
  },
  InviteFacultyModal_subheader: {
    color: COLORS.lightBlack,
    fontSize: '16px',
    margin: '0px auto 21px',
    textAlign: 'center',
  },
  InviteFacultyModal_smallText: {
    fontSize: '12px',
    margin: '6px auto 12px',
  },
  InviteFacultyModal_messageToggle: {
    paddingLeft: '9px',
    textDecoration: 'underline',
    cursor: 'pointer',
    color: COLORS.blue
  }
});

const initialState = {
  contactModalLoading: false,
  message: '',
  toEmails: '',
  isExpanded: false,
  showRFPName: false,
}

class InviteFacultyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.open !== this.props.open) {
      this.setState(initialState);
    }
  }

  handleSubmitMessage = async (e) => {
    const {
      closeInviteFacultyModal,
      requestForProposal,
    } = this.props;

    e.preventDefault();

    const {
      message,
      isExpanded,
      toEmails,
    } = this.state;

    this.setState({
      contactModalLoading: true,
    });

    const formData = new FormData();
    if (isExpanded && message && message.length > 0) {
      formData.append('message', message);
    }
    formData.append('request_for_proposal_id', requestForProposal.id);
    formData.append('to_emails', toEmails);

    try {
      const messageResponse = await fetch('/messages/request_for_proposal_contact', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await messageResponse.json();
      if (!responseJson.success) {
        this.setState({
          contactModalLoading: false,
        });
      } else {
        this.setState({
          message: '',
          contactModalLoading: false,
        });
        closeInviteFacultyModal();
        window.location.reload();
      }
    } catch(err) {
      this.setState({ contactModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  render() {
    const {
      open,
      requestForProposal,
      closeInviteFacultyModal,
      showRFPName,
    } = this.props;

    const {
      message,
      toEmails,
      isExpanded,
      contactModalLoading,
    } = this.state;

    return (
      <Modal
        open={open}
        onClose={closeInviteFacultyModal}
        size="tiny"
        className={`${css(styles.InviteFacultyModal_modal)} scrolling`}
      >
        <Modal.Content className={`${css(styles.InviteFacultyModal_content)} scrolling`}>
          <div className={css(styles.InviteFacultyModal_header)}>Invite Faculty</div>
          <div className={css(styles.InviteFacultyModal_subheader)}>Send opportunity to faculty</div>
          {showRFPName && <div className={css(styles.InviteFacultyModal_subheader)}>{(requestForProposal || {}).title}</div>}
          <div>
            <input
              type="text"
              className={css(styles.InviteFacultyModal_modalInput)}
              placeholder='Enter emails separated by commas'
              value={toEmails}
              onChange={(e) => this.handleChange(e, 'toEmails')}
            />
          </div>
          <div className={css(styles.InviteFacultyModal_smallText)}>
            {isExpanded ? "Remove custom message" :
              <>
                <span>(Optional)</span>
                <a
                  className={css(styles.InviteFacultyModal_messageToggle)}
                  onClick={() => {
                    this.setState({ isExpanded: !this.state.isExpanded })
                  }}
                >
                  Add message
                </a>
              </>
            }
          </div>
          {isExpanded && (
            <div>
              <textarea
                className={css(styles.InviteFacultyModal_modalTextArea)}
                placeholder='Enter message here'
                value={message}
                rows={5}
                onChange={(e) => this.handleChange(e, 'message')}
              />
            </div>
          )}
          <div className={css(styles.InviteFacultyModal_modalButtonHolder)}>
            <Button
              className={css(styles.InviteFacultyModal_modalSubmitButton)}
              type='submit'
              disabled={contactModalLoading}
              onClick={this.handleSubmitMessage}
            >
              Send
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

InviteFacultyModal.propTypes = {
  requestForProposal: PropTypes.object,
  open: PropTypes.bool,
  closeInviteFacultyModal: PropTypes.func,
};

export default InviteFacultyModal;
