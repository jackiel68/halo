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
  AboutEditModal_modal: {

  },
  AboutEditModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  AboutEditModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  AboutEditModal_modalSubmitButton: {
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
  AboutEditModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  AboutEditModal_modalCancelButton: {
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

class AboutEditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      aboutEditModalLoading: false,
      text: props.text,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({ text: this.props.text });
    }
  }

  handleSubmitMessage = async (e) => {
    const {
      closeModal,
      userId,
    } = this.props;

    e.preventDefault();

    const {
      text,
    } = this.state;

    this.setState({
      aboutEditModalLoading: true,
    });

    const formData = new FormData();
    formData.append('about', text);
    formData.append('user_id', userId);

    try {
      const textResponse = await fetch(`/user_profile_infos/${userId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await textResponse.json();
      if (!responseJson.success) {
        this.setState({
          aboutEditModalLoading: false,
        });
      } else {
        this.setState({
          text: '',
          aboutEditModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ aboutEditModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  render() {
    const {
      open,
      proposal,
      closeModal,
    } = this.props;

    const {
      text,
    } = this.state;

    const validMessage = !!!text;
    return (
      <Modal
        open={open}
        onClose={closeModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.AboutEditModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.AboutEditModal_modalFieldLabel)}>
            About
          </div>
          <div>
            <textarea
              className={css(styles.AboutEditModal_modalTextArea)}
              rows="4"
              value={text}
              onChange={(e) => this.handleChange(e, 'text')}
            />
          </div>
          <div className={css(styles.AboutEditModal_modalButtonHolder)}>
            <Button
              className={css(styles.AboutEditModal_modalCancelButton)}
              type='submit'
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.AboutEditModal_modalSubmitButton)}
              type='submit'
              disabled={validMessage}
              onClick={this.handleSubmitMessage}
            >
              Save
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

AboutEditModal.propTypes = {
  proposal: PropTypes.object,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default AboutEditModal;
