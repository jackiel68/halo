import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Container, Input, Button } from 'semantic-ui-react';
import Validator from 'validator';

import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  Account_innerContainer: {
    width: '555px',
    position: 'relative',
    textAlign: 'left',
  },
  Account_inputGroup: {
    display: 'inline-block',
    width: '45%',
  },
  Account_inputGroupRight: {
    display: 'inline-block',
    width: '45%',
    marginLeft: '10%',
  },
  Account_inlineSection: {

  },
  Account_header: {
    fontSize: '14px',
    color: COLORS.lightBlack,
    fontWeight: 'bold',
    letterSpacing: '1px',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  Account_label: {
    lineHeight: '16px',
    fontWeight: 500,
    fontSize: '12px',
    color: COLORS.darkGray,
    marginBottom: '6px',
  },
  Account_error: {
    color: COLORS.red,
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '-20px',
    marginBottom: '20px',
  },
  Account_input: {
    borderStyle: 'solid',
    borderWidth: '1px',
    color: COLORS.darkGray,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    height: '48px',
    marginBottom: '24px',
    padding: '14px 16px',
    width: '100%',
  },
  Account_submitButton: {
    padding: '12px 30px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    float: 'right',
  },
  Account_banner: {
    textAlign: 'center',
    width: '100%',
    height: '48px',
    backgroundColor: COLORS.green,
    opacity: '0.8',
    color: COLORS.white,
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Account_errorBanner: {
    textAlign: 'center',
    width: '100%',
    height: '48px',
    backgroundColor: COLORS.pink,
    opacity: '0.8',
    color: COLORS.white,
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Account extends PureComponent {
  constructor(props) {
    super(props);
    if (!gon.current_user) {
      window.location.href = "/";
    }

    this.state = {
      firstName: gon.current_user.first_name,
      lastName: gon.current_user.last_name,
      email: gon.current_user.email,
      phoneNumber: gon.current_user.phone,
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
      hasSubmitted: false,
      isSubmitting: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      hasSubmitted: false,
      success: false,
      errorMessage: false,
      [e.target.name]: e.target.value,
    });
  };

  submitChanges = async () => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      hasSubmitted,
      oldPassword,
      newPassword,
      repeatNewPassword,
    } = this.state;

    this.setState({ hasSubmitted: true });

    if (!this.validEmail() || !this.validPhone() || !this.validNames()) {
      return;
    }

    if (newPassword.length > 0 && (oldPassword.length === 0 || !this.validPassword())) {
      return;
    }

    this.setState({
      isSubmitting: true,
    });

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    if (phoneNumber) {
      formData.append('phone', phoneNumber);
    }
    if (oldPassword && oldPassword.length > 0 && newPassword && newPassword.length > 0) {
      formData.append('old_password', oldPassword);
      formData.append('password', newPassword);
      formData.append('password_confirmation', repeatNewPassword);
    }

    try {
      const updateResponse = await fetch(`/users/${gon.current_user.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await updateResponse.json();
      if (!responseJson.success) {
        this.setState({
          isSubmitting: false,
          errorMessage: responseJson.errors,
        });
      } else {
        this.setState({
          success: true,
          isSubmitting: false,
        });
      }
    } catch(err) {
      this.setState({
        isSubmitting: false,
        errorMessage: 'Something went wrong. Try again.',
      });
    }
    this.setState({
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    });
  };

  validNames = () => {
    const { firstName, lastName } = this.state;
    return (!gon.current_user.first_name || firstName.length > 0) &&
      (!gon.current_user.last_name || lastName.length > 0);
  };

  validEmail = () => {
    const { email } = this.state;
    return email && Validator.isEmail(email);
  };

  validPhone = () => {
    const { phoneNumber } = this.state;
    return !phoneNumber || Validator.isMobilePhone(phoneNumber);
  };

  validPassword = () => {
    const { newPassword, repeatNewPassword } = this.state;
    return newPassword.length === 0 || Validator.isLength(newPassword, { min: 6, max: 30 }) && newPassword === repeatNewPassword;
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      hasSubmitted,
      oldPassword,
      newPassword,
      repeatNewPassword,
      isSubmitting,
      success,
      errorMessage,
    } = this.state;

    if (!gon.current_user) {
      window.location.href = "/";
    }

    return (
      <Container>
        <br />
        <div className={css(styles.Account_innerContainer)}>
          {success &&
            <div className={css(styles.Account_banner)}>
              Successfully updated!
            </div>}
          {errorMessage && errorMessage.length > 0 &&
            <div className={css(styles.Account_errorBanner)}>
              {errorMessage}
            </div>
          }
          <div className={css(styles.Account_header)}>PERSONAL INFORMATION</div>
          <div className={css(styles.Account_inlineSection)}>
            <div className={css(styles.Account_inputGroup)}>
              <div className={css(styles.Account_label)}>First Name</div>
              <input className={css(styles.Account_input)} onChange={this.handleChange} name="firstName" type="text" value={firstName} />
            </div>
            <div className={css(styles.Account_inputGroupRight)}>
              <div className={css(styles.Account_label)}>Last Name</div>
              <input className={css(styles.Account_input)} onChange={this.handleChange} name="lastName" type="text" value={lastName} />
            </div>
          </div>
          {hasSubmitted && !this.validNames() && <div className={css(styles.Account_error)}>Please enter valid first and last name</div>}
          <div className={css(styles.Account_label)}>Email</div>
          <input className={css(styles.Account_input)} onChange={this.handleChange} name="email" type="text" value={email} />
          {hasSubmitted && !this.validEmail() && <div className={css(styles.Account_error)}>Please enter a valid email</div>}
          <div className={css(styles.Account_label)}>Phone Number</div>
          <input className={css(styles.Account_input)} onChange={this.handleChange} name="phoneNumber" type="text" value={phoneNumber} />
          {hasSubmitted && !this.validPhone() && <div className={css(styles.Account_error)}>Please enter a valid phone number</div>}
          <br />
          <br />
          <br />
          <div className={css(styles.Account_header)}>PASSWORD</div>
          <div className={css(styles.Account_label)}>Current</div>
          <input className={css(styles.Account_input)} onChange={this.handleChange} name="oldPassword" type="password" value={oldPassword} />
          {hasSubmitted && newPassword.length > 0 && oldPassword.length === 0 && <div className={css(styles.Account_error)}>Please enter current password as well</div>}
          <div className={css(styles.Account_label)}>New Password</div>
          <input className={css(styles.Account_input)} onChange={this.handleChange} name="newPassword" type="password" value={newPassword} />
          {hasSubmitted && !this.validPassword() && <div className={css(styles.Account_error)}>Please make sure new password is between 6 and 30 characters and matches below</div>}
          <div className={css(styles.Account_label)}>Repeat New Password</div>
          <input className={css(styles.Account_input)} onChange={this.handleChange} name="repeatNewPassword" type="password" value={repeatNewPassword} />
          <br />
          <Button
            onClick={this.submitChanges}
            disabled={isSubmitting}
            className={css(styles.Account_submitButton)}
          >
            Save Changes
          </Button>
        </div>
      </Container>
    );
  }
}

export default Account;
