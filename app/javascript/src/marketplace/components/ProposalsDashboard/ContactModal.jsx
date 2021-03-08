import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { COLORS, PROPOSAL_STATUSES } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  ContactModal_modal: {

  },
  ContactModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  ContactModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  ContactModal_modalSubmitButton: {
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
  ContactModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  ContactModal_modalCancelButton: {
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
  ContactModal_title: {
    fontSize: '24px',
  },
  ContactModal_dropdown: {
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
});

class ContactModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contactModalLoading: false,
      message: '',
      title: '',
      emailTemplate: {},
      emailResponseTemplates: [],
      emailResponseTemplateOptions: [],
    };
  }

  componentDidUpdate = async (prevProps) => {
    if (prevProps.status !== this.props.status && this.props.status === PROPOSAL_STATUSES.DECLINED) {
      await this.fetchEmailResponseTemplates();
    }
  }

  fetchEmailResponseTemplates = async () => {
    const emailTemplateResponse = await fetch(`/email_response_templates?user_id=${gon.current_user.id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const responseJson = await emailTemplateResponse.json();

    this.setState({
      emailResponseTemplates: responseJson.email_response_templates,
      emailResponseTemplateOptions: responseJson.email_response_templates.map(emailResponse => (
        {
          key: emailResponse.id,
          text: emailResponse.title,
          value: emailResponse.id,
        }
      )),
    });
  };

  handleSaveResponse = async (e) => {
    e.preventDefault();

    const {
      message,
      title,
    } = this.state;

    this.setState({
      contactModalLoading: true,
    });

    const formData = new FormData();

    formData.append('content', message);
    formData.append('title', title);

    try {
      const saveTemplateResponse = await fetch('/email_response_templates', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await saveTemplateResponse.json();

    } catch(err) {
      this.setState({ contactModalLoading: false });
    }
  }

  handleSubmitMessage = async (e) => {
    const {
      closeContactModal,
      proposal,
      status,
      fetchProposals,
    } = this.props;

    e.preventDefault();

    const {
      message,
    } = this.state;

    this.setState({
      contactModalLoading: true,
    });

    const formData = new FormData();
    formData.append('message', message.replace(/\n/g, '<br />'));
    formData.append('proposal_id', proposal.id);
    formData.append('status', status);

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
        await fetchProposals(proposal.request_for_proposal_id);
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

  handleSelectEmailTemplate = (e, selection) => {
    const { proposal } = this.props;
    const { emailResponseTemplates } = this.state;
    const selectedTemplate = _.find(emailResponseTemplates, (template) => {
      return Number(template.id) === Number(selection.value);
    });
    this.setState({
      emailTemplate: selectedTemplate,
      message: `Hi ${proposal.user.first_name},\n\n${selectedTemplate.content}\n\nThank you,\n${gon.current_user.first_name}`,
    });
  }

  render() {
    const {
      open,
      proposal,
      closeContactModal,
      status,
    } = this.props;

    const {
      message,
      emailTemplate,
      emailResponseTemplates,
      emailResponseTemplateOptions,
    } = this.state;

    const validMessage = !!!message;
    return (
      <Modal
        open={open}
        onClose={closeContactModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.ContactModal_modal)} scrolling`}
      >
        <Modal.Content>
          {status === PROPOSAL_STATUSES.DECLINED ? <h4 className={css(styles.ContactModal_title)}>Decline Message</h4> : <h4 className={css(styles.ContactModal_title)}>Message</h4>}
          {proposal && <div style={{ fontSize: '12px' }}><b>To:</b> {proposal.user.first_name} {proposal.user.last_name}</div>}
          <br />
          {status === PROPOSAL_STATUSES.DECLINED &&
            <>
              <div className={css(styles.ContactModal_modalFieldLabel)}>Decline reason</div>
              <Dropdown
                className={css(styles.ContactModal_dropdown)}
                icon="chevron down"
                fluid
                selection
                placeholder="Choose a saved template"
                value={emailTemplate.id}
                options={emailResponseTemplateOptions}
                onChange={this.handleSelectEmailTemplate}
              />
            </>
          }
          <div>
            <textarea
              className={css(styles.ContactModal_modalTextArea)}
              rows="4"
              value={message}
              onChange={(e) => this.handleChange(e, 'message')}
            />
          </div>
          <div className={css(styles.ContactModal_modalButtonHolder)}>
            <Button
              className={css(styles.ContactModal_modalCancelButton)}
              type='submit'
              onClick={closeContactModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.ContactModal_modalSubmitButton)}
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

ContactModal.propTypes = {
  proposal: PropTypes.object,
  open: PropTypes.bool,
  closeContactModal: PropTypes.func,
};

export default ContactModal;
