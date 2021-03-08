import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import _, { debounce } from 'lodash';
import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  ExpertiseEditModal_modal: {
    overflow: 'visible',
  },
  ExpertiseEditModal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  ExpertiseEditModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  ExpertiseEditModal_modalTextInput: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: COLORS.lightBlack,
    borderColor: COLORS.gray,
  },
  ExpertiseEditModal_modalSubmitButton: {
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
  ExpertiseEditModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  ExpertiseEditModal_modalCancelButton: {
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
  ExpertiseEditModal_dropdown: {
    width: '100%',
    display: 'flex',
    height: '48px',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: COLORS.gray,
    margin: 'auto',
    fontSize: '14px',
  },
  ExpertiseEditModal_input: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    marginTop: '10px',
  },
});

class ExpertiseEditModal extends PureComponent {
  constructor(props) {
    super(props);

    let areasOfExpertise = props.currentUser && props.currentUser.profile_info ? props.currentUser.profile_info.area_of_expertise : '';
    let parsedOtherSpecialty = '';
    if (areasOfExpertise) {
      const areasOfExpertiseArray = areasOfExpertise.split(',');
      parsedOtherSpecialty = areasOfExpertiseArray.filter((exp) => !gon.areas_of_expertise.map((opt) => opt.text).includes(exp));

      if (parsedOtherSpecialty && parsedOtherSpecialty.length > 0) {
        parsedOtherSpecialty = parsedOtherSpecialty[0];
        areasOfExpertise = areasOfExpertise.replace(parsedOtherSpecialty, 'Other Research Area').split(',');
      } else {
        parsedOtherSpecialty = '';
        areasOfExpertise = areasOfExpertise.split(',');
      }
      areasOfExpertise = areasOfExpertise.map((exp) => gon.areas_of_expertise_inverse_mapping[exp]);
    }

    this.state = {
      expertiseEditModalLoading: false,
      expertise: areasOfExpertise || '',
      otherSpecialty: parsedOtherSpecialty || '',
      expertiseOptions: gon.areas_of_expertise,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUser &&
        this.props.currentUser.profile_info &&
        (!prevProps.currentUser ||
         !prevProps.currentUser.profile_info ||
         prevProps.currentUser.profile_info.area_of_expertise !== this.props.currentUser.profile_info.area_of_expertise)) {

      let areasOfExpertise = this.props.currentUser.profile_info.area_of_expertise;
      let parsedOtherSpecialty = '';
      if (areasOfExpertise) {
        const areasOfExpertiseArray = areasOfExpertise.split(',');
        parsedOtherSpecialty = areasOfExpertiseArray.filter((exp) => !gon.areas_of_expertise.map((opt) => opt.text).includes(exp));
        if (parsedOtherSpecialty && parsedOtherSpecialty.length > 0) {
          parsedOtherSpecialty = parsedOtherSpecialty[0];
          areasOfExpertise = areasOfExpertise.replace(parsedOtherSpecialty, 'Other Research Area').split(',');
        } else {
          parsedOtherSpecialty = '';
          areasOfExpertise = areasOfExpertise.split(',');
        }

        areasOfExpertise = areasOfExpertise.map((exp) => gon.areas_of_expertise_inverse_mapping[exp]);
      }

      this.setState({
        expertise: areasOfExpertise || '',
        otherSpecialty: parsedOtherSpecialty || '',
      });
    }
  }

  handleSubmitMessage = async (e) => {
    const {
      currentUser,
    } = this.props;

    if (!currentUser) {
      return;
    }

    e.preventDefault();

    const {
      expertise,
      otherSpecialty,
    } = this.state;

    this.setState({
      expertiseEditModalLoading: true,
    });

    const formData = new FormData();
    formData.append('area_of_expertise', expertise.map((exp) => exp.replace('other_specialty', otherSpecialty)));
    try {
      const expertiseResponse = await fetch(
        `/user_profile_infos/${currentUser.id}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'X-CSRF-Token': authenticityToken(),
          }
        }
      );
      const responseJson = await expertiseResponse.json();
      if (!responseJson.success) {
        this.setState({
          expertiseEditModalLoading: false,
        });
      } else {
        this.setState({
          expertiseEditModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ expertiseEditModalLoading: false });
    }
  }

  handleExpertise = (e, selection) => {
    this.setState({
      expertise: selection.value,
    });
  };

  handleOtherSpecialty = (e, selection) => {
    this.setState({
      otherSpecialty: e.target.value,
    })
  };

  render() {
    const {
      open,
      degree,
      closeModal,
    } = this.props;

    const {
      expertise,
      expertiseOptions,
      expertiseEditModalLoading,
      otherSpecialty,
    } = this.state;

    return (
      <Modal
        open={open}
        onClose={closeModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.ExpertiseEditModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.ExpertiseEditModal_modalHeader)}>
            What are your areas of expertise?
          </div>
          <div className="onboarding-dropdown">
            <Dropdown
              className={css(styles.ExpertiseEditModal_dropdown)}
              icon="chevron down"
              placeholder='Area of expertise'
              fluid
              selection
              multiple
              value={expertise}
              options={expertiseOptions}
              onChange={this.handleExpertise}
            />
          </div>
          {expertise.includes('other_specialty') &&
            <input
              className={css(styles.ExpertiseEditModal_input)}
              placeholder='Specify your specialty...'
              value={otherSpecialty}
              onChange={this.handleOtherSpecialty}
            />}
          <div className={css(styles.ExpertiseEditModal_modalButtonHolder)}>
            <Button
              className={css(styles.ExpertiseEditModal_modalCancelButton)}
              type='submit'
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.ExpertiseEditModal_modalSubmitButton)}
              type='submit'
              disabled={
                !expertise ||
                expertiseEditModalLoading ||
                (expertise.includes('other_specialty') && !otherSpecialty)
              }
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

ExpertiseEditModal.propTypes = {
  education: PropTypes.object,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default ExpertiseEditModal;
