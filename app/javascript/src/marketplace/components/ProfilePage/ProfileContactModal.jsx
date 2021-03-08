import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  ProfileContactModal_modal: {

  },
  ProfileContactModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  ProfileContactModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  ProfileContactModal_modalSubmitButton: {
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
  },
  ProfileContactModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  ProfileContactModal_modalCancelButton: {
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
});

class ProfileContactModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contactModalLoading: false,
      message: '',
    };
  }

  handleSubmitMessage = async (e) => {
    const {
      closeProfileContactModal,
      proposal,
    } = this.props;

    e.preventDefault();

    const {
      message,
    } = this.state;

    this.setState({
      contactModalLoading: true,
    });

    const formData = new FormData();
    formData.append('message', message);
    formData.append('proposal_id', proposal.id);

    try {
      const messageResponse = await fetch('/messages/proposal_contact', {
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
      proposal,
      closeProfileContactModal,
    } = this.props;

    const {
      message,
    } = this.state;

    const validMessage = !!!message;
    return (
      <Modal
        open={open}
        onClose={closeProfileContactModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.ProfileContactModal_modal)} scrolling`}
      >
        <Modal.Header>
          {proposal && <div>Send an email to {proposal.user.first_name} {proposal.user.last_name}</div>}
        </Modal.Header>
        <Modal.Content>
          <div className={css(styles.ProfileContactModal_modalFieldLabel)}>
            Message
          </div>
          <div>
            <textarea
              className={css(styles.ProfileContactModal_modalTextArea)}
              placeholder='-'
              rows="4"
              value={message}
              onChange={(e) => this.handleChange(e, 'message')}
            />
          </div>
          <div className={css(styles.ProfileContactModal_modalButtonHolder)}>
            <Button
              className={css(styles.ProfileContactModal_modalCancelButton)}
              type='submit'
              onClick={closeProfileContactModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.ProfileContactModal_modalSubmitButton)}
              type='submit'
              disabled={validMessage}
              onClick={this.handleSubmitMessage}
            >
              Send Email
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

ProfileContactModal.propTypes = {
  proposal: PropTypes.object,
  open: PropTypes.bool,
  closeProfileContactModal: PropTypes.func,
};

export default ProfileContactModal;
