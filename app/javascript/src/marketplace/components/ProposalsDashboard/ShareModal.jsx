import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown, Input, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Validator from 'validator';
import { COLORS, PROPOSAL_STATUSES } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  ShareModal_modal: {

  },
  ShareModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  ShareModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
    border: `1px solid ${COLORS.lightGray}`,
  },
  ShareModal_modalSubmitButton: {
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
  },
  ShareModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
    marginBottom: '25px',
  },
  ShareModal_modalCancelButton: {
    height: '48px',
    textAlign: 'center',
    color: COLORS.lightBlack,
    backgroundColor: COLORS.white,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '5px 50px',
  },
  ShareModal_title: {
    fontSize: '24px',
  },
  ShareModal_dropdown: {
    width: '50%',
    display: 'flex',
    height: '48px',
    alignItems: 'center',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: COLORS.gray,
    marginBottom: '20px',
    fontSize: '14px',
  },
  ShareModal_label: {
    display: 'block',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
  },
  ShareModal_inputField: {
    width: '100%',
    border: `1px solid ${COLORS.lightGray}`,
    padding: '5px 12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  ShareModal_firstNameField: {
    marginTop: '15px',
    marginBottom: '15px',
    marginRight: '4%',
    width: '48%',
    display: 'inline-block',
  },
  ShareModal_lastNameField: {
    marginTop: '15px',
    marginBottom: '15px',
    width: '48%',
    display: 'inline-block',
  },
  ShareModal_formField: {
    marginBottom: '15px',
  },
  ShareModal_header: {
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'center',
    margin: 'auto',
    marginTop: '40px',
    color: COLORS.lightBlack,
  },
  ShareModal_subheader: {
    fontSize: '14px',
    textAlign: 'center',
    margin: 'auto',
    color: COLORS.lightBlack,
    marginBottom: '15px',
  },
});

class ShareModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shareModalLoading: false,
      message: '',
      firstName: '',
      lastName: '',
      email: '',
    };
  }

  handleSubmitMessage = async (e) => {
    const {
      closeShareModal,
      proposal,
    } = this.props;

    e.preventDefault();

    const {
      message,
      email,
      firstName,
      lastName,
    } = this.state;

    this.setState({
      shareModalLoading: true,
    });

    const formData = new FormData();
    formData.append('message', message);
    formData.append('proposal_id', proposal.id);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);

    try {
      const messageResponse = await fetch('/messages/share_proposal', {
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
          shareModalLoading: false,
        });
      } else {
        this.setState({
          message: '',
          shareModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ shareModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  render() {
    const {
      open,
      proposal,
      closeShareModal,
    } = this.props;

    const {
      message,
      firstName,
      lastName,
      email,
      shareModalLoading,
    } = this.state;

    const validMessage =
      !shareModalLoading &&
      !Validator.isEmpty(message) &&
      !Validator.isEmpty(firstName) &&
      !Validator.isEmpty(lastName) &&
      !Validator.isEmpty(email) &&
      Validator.isEmail(email);
    return (
      <Modal
        open={open}
        onClose={closeShareModal}
        size="tiny"
        closeOnDimmerClick
        className={`${css(styles.ShareModal_modal)} scrolling`}
      >
        <Modal.Content>
          <Icon size="large" name="close" onClick={closeShareModal} />
          <div className={css(styles.ShareModal_header)}>Send to colleague</div>
          <div className={css(styles.ShareModal_subheader)}>Who would you like to see the proposal?</div>
          <div>
            <div className={css(styles.ShareModal_firstNameField)}>
              <input
                className={css(styles.ShareModal_inputField)}
                name='firstName'
                value={firstName}
                placeholder='First Name'
                onChange={(e) => this.handleChange(e, 'firstName')}
              />
            </div>
            <div className={css(styles.ShareModal_lastNameField)}>
              <input
                className={css(styles.ShareModal_inputField)}
                name='lastName'
                value={lastName}
                placeholder='Last Name'
                onChange={(e) => this.handleChange(e, 'lastName')}
              />
            </div>
          </div>
          <div className={css(styles.ShareModal_formField)}>
            <Input
              className={css(styles.ShareModal_inputField)}
              name='email'
              fluid
              transparent
              type="text"
              icon="mail outline"
              value={email}
              placeholder='Email'
              onChange={(e) => this.handleChange(e, 'email')}
            />
          </div>
          <div>
            <textarea
              placeholder="Add a message (optional)"
              className={css(styles.ShareModal_modalTextArea)}
              rows="4"
              value={message}
              onChange={(e) => this.handleChange(e, 'message')}
            />
          </div>
          <div className={css(styles.ShareModal_modalButtonHolder)}>
            <Button
              className={css(styles.ShareModal_modalSubmitButton)}
              type='submit'
              disabled={!validMessage}
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

ShareModal.propTypes = {
  proposal: PropTypes.object,
  open: PropTypes.bool,
  closeShareModal: PropTypes.func,
};

export default ShareModal;
