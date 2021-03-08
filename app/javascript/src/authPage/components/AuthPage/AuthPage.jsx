import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { Container, Grid, Button, Form, Input, Message, Dropdown } from 'semantic-ui-react'
import Validator from 'validator';
import axios from 'axios';

import { COLORS, WINDOW_DIMENSIONS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import signUpGraphic from '../../../../images/backgrounds/partner-background.png';
import scientistSignUpGraphic from '../../../../images/backgrounds/scientist-background.png';
import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import { authenticityToken, getCookie } from '../../../marketplace/utils/requests';

const {
  MOBILE_MEDIA_QUERY,
  TABLET_MEDIA_QUERY,
  TABLET_LANDSCAPE_MEDIA_QUERY
} = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  AuthPage_container: {
    height: '100%',
    paddingBottom: '1px',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: '-100'
  },
  AuthPage_backgroundPane: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    position: 'absolute',
    backgroundColor: COLORS.darkBlue,
    backgroundImage: `url(${signUpGraphic})`,
    backgroundSize: 'cover',
    zIndex: -100,
  },
  AuthPage_scientist_backgroundImage: {
    backgroundImage: `url(${scientistSignUpGraphic})`,
  },
  AuthPage_innerContainer: {
    backgroundColor: 'white',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    padding: '30px',
    width: '55%',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '90%',
    },
    [MOBILE_MEDIA_QUERY]: {
      padding: '5px',
      width: '95%',
      left: '50%',
      top: '20px',
      transform: 'translateX(-50%)'
    },
  },
  AuthPage_grid: {
    // height: '675px',
  },
  AuthPage_logoContainer: {
    marginTop: '25px',
    textAlign: 'center',
  },
  AuthPage_headline: {
    color: COLORS.lightBlack,
    fontSize: '36px',
    fontWeight: 'bold',
    lineHeight: '48px',
    marginBottom: '10px',
  },
  AuthPage_subheadline: {
    color: COLORS.darkGray,
    marginTop: '20px',
    fontSize: '18px',
    lineHeight: '24px',
  },
  AuthPage_innerRightPane: {
    paddingTop: '15px',
    width: '50%',
    display: 'inline-block',
    [MOBILE_MEDIA_QUERY]: {
      paddingTop: '0',
      width: '100%',
      margin: 'auto',
    },
  },
  AuthPage_signupPanel: {
    marginTop: '20px',
  },
  AuthPage_horizontalRule: {
    marginTop: '20px',
    marginBottom: '16px',
  },
  AuthPage_alreadyHaveAccount: {
    textAlign: 'center',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '24px',
    color: COLORS.lightBlack,
    width: '100%',
    marginBottom: '10px',
  },
  AuthPage_signInLink: {
    marginLeft: '5px',
    display: 'inline-block',
    fontWeight: 'normal',
    fontSize: '14px',
    textDecoration: 'none',
    color: COLORS.lightBlack,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  AuthPage_label: {
    display: 'block',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
  },
  AuthPage_inputField: {
    width: '100%',
    border: `1px solid ${COLORS.lightGray}`,
    padding: '5px 12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  AuthPage_dropdown: {
    width: '100%',
    height: '48px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${COLORS.lightGray}`,
  },
  AuthPage_submitButton: {
    marginTop: '10px',
    width: '100%',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    padding: '12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  AuthPage_formField: {
    marginTop: '15px',
    marginBottom: '15px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  AuthPage_forgotPasswordContainer: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '13px',
    color: COLORS.lightBlack,
  },
  AuthPage_firstNameField: {
    marginBottom: '0',
    marginRight: '4%',
    width: '48%',
    display: 'inline-block',
  },
  AuthPage_lastNameField: {
    marginBottom: '0',
    width: '48%',
    display: 'inline-block',
  },
  AuthPage_forgotPassword: {
    textDecoration: 'none',
    color: COLORS.darkGray,
    fontSize: '13px',
    lineHeight: '24px',
    textDecoration: 'underline',
  },
  AuthPage_container: {
    height: '100%',
    paddingBottom: '1px',
  },
  AuthPage_backgroundPane: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    position: 'absolute',
    backgroundColor: COLORS.darkBlue,
    backgroundImage: `url(${signUpGraphic})`,
    backgroundSize: 'cover',
    zIndex: -100,
  },
  AuthPage_grid: {

  },
  AuthPage_hero: {
    marginTop: '40px',

    [MOBILE_MEDIA_QUERY]: {
      marginTop: '25px',
    },
  },
  AuthPage_headline: {
    color: COLORS.lightBlack,
    fontSize: '36px',
    fontWeight: 'bold',
    lineHeight: '48px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  AuthPage_subheadline: {
    color: COLORS.darkGray,
    fontSize: '18px',
    lineHeight: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  AuthPage_innerLeftPane: {
    width: '50%',
    display: 'inline-block',
    verticalAlign: 'top',
    padding: '30px 10px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      margin: 'auto',
      padding: '8px 0px'
    },
  },
  AuthPage_signupPanel: {

  },
  AuthPage_alreadyHaveAccount: {
    textAlign: 'center',
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: 'bold',
    lineHeight: '24px',
    width: '100%',
    color: COLORS.lightBlack,
  },
  AuthPage_signInLink: {
    marginLeft: '5px',
    display: 'inline-block',
    fontWeight: 'normal',
    textDecoration: 'none',
    color: COLORS.lightBlack,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  AuthPage_label: {
    display: 'block',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
  },
  AuthPage_footerText: {
    color: COLORS.lightBlack,
    fontSize: '12px',
  },
  AuthPage_inputField: {
    width: '100%',
    border: `1px solid ${COLORS.lightGray}`,
    padding: '5px 12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  AuthPage_submitButton: {
    marginTop: '10px',
    width: '100%',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    padding: '12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  AuthPage_forgotPasswordContainer: {
    textAlign: 'center',
    marginTop: '10px',
  },
  AuthPage_forgotPassword: {
    textDecoration: 'underline',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '24px',
  },
  AuthPage_modalText: {
    color: COLORS.lightBlack,
    fontSize: '16px',
    width: '90%',
    marginBottom: '15px',
    display: 'flex',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      marginBottom: '8px'
    },
  },
  AuthPage_lineItem: {
    marginLeft: '5px',
  },
  AuthPage_companyField: {
    marginTop: '15px',
    marginBottom: '15px',
  },
});

class AuthPage extends PureComponent {
  state = {
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    isSubmitting: false,
    hasSubmitted: false,
    error: '',
    errors: {},
    company: '',
    companyOptions: gon.companies,
  };

  handleChange = (e) => {
    this.setState({
      hasSubmitted: false,
      [e.target.name]: e.target.value,
    });
  };

  handleCompany = (e, selection) => {
    this.setState({
      hasSubmitted: false,
      company: selection.value,
    });
  };

  handleAddition = (e, { value }) => {
    this.setState((prevState) => ({
      companyOptions: [{ text: value, key: value, value }, ...prevState.companyOptions],
    }))
  }

  handleLogin = async () => {
    const { email, password } = this.state;

    this.setState({
      isSubmitting: true,
      errors: '',
      hasSubmitted: true,
    });

    if (this.invalidSubmit()) {
      this.setState({
        error: 'Invalid login',
        isSubmitting: false,
      });
      return;
    }

    try {
      const responseJson = await axios.post('/users/sign_in', {
        user: {
          email,
          password,
        }
      },
      {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      window.location.href = '/redirect_login';
    } catch(error) {
      this.setState({
        isSubmitting: false,
        error: error.response.data.error
      });
    }
  };

  submitToHubspot = async () => {
    if (window.location.host.includes("halocures.com")) {
      const { email, firstName, lastName, company } = this.state;
      const { isUniversity, isCompany } = this.props;

      const portalID = '6895929';

      // Scientist Registration
      let formID = '5fb3e11f-bf56-4b75-9a0b-632e5888e33f';

      if (isCompany) {
        formID = 'de8f6135-4e40-4d48-9b48-b5dcd36fd945';
      } else if (isUniversity) {
        formID = '9091aea2-ed31-496e-97ee-eed2ff1f6b95';
      }
      // https://developers.hubspot.com/docs/methods/forms/submit_form_v3
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalID}/${formID}`;

      try {
        await axios.post(url, {
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: firstName },
            { name: 'lastname', value: lastName },
            ...isCompany ? [{ name: 'company', value: company }] : [],
          ],
          context: {
            hutk: getCookie('hubspotutk'),
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleRegister = async () => {
    const { email, password, firstName, lastName, company } = this.state;
    const { isUniversity, isCompany } = this.props;

    this.setState({
      isSubmitting: true,
      errors: {},
      hasSubmitted: true,
    });

    if (this.invalidSubmit()) {
      this.setState({
        error: 'Invalid registration details',
        isSubmitting: false,
      });
      return;
    }

    try {
      const responseJson = await axios.post('/users', {
        user: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          ...isCompany && { company },
        },
        ...isUniversity && { university: true }
      },
      {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      await this.submitToHubspot();

      window.location.href = '/redirect_login';
    } catch(error) {
      this.setState({
        isSubmitting: false,
        errors: error.response.data.errors
      });
    }
  };

  invalidSubmit = () => {
    const {
      email,
      password,
      firstName,
      lastName,
      company,
    } = this.state;
    const { isLogin, isCompany } = this.props;

    if (isLogin) {
      return (Validator.isEmpty(email) || !Validator.isEmail(email));
    } else {
      return (Validator.isEmpty(firstName) ||
       (isCompany && Validator.isEmpty(company)) ||
       Validator.isEmpty(lastName) ||
       Validator.isEmpty(email) ||
       !Validator.isEmail(email) ||
       !Validator.isLength(password, { min: 6, max: 30 }));
    }
  }

  render() {
    const {
      email,
      password,
      firstName,
      lastName,
      isSubmitting,
      hasSubmitted,
      error,
      errors,
      companyOptions,
      company,
    } = this.state;

    const {
      lineItems,
      loginHeadline,
      signupHeadline,
      isLogin,
      switchLink,
      isCompany,
      isScientist,
    } = this.props;

    const hasErrors = hasSubmitted && (error.length > 0 || Object.keys(errors).length > 0);

    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <div className={css(styles.AuthPage_innerContainer)}>
          <div className={css(styles.AuthPage_logoContainer)}>
            <a href="/">
              <img src={haloLogo} />
            </a>
          </div>
          <Grid centered columns={2} className={css(styles.AuthPage_grid)}>
            <Grid.Row centered columns={2}>
              <Grid.Column width={15}>
                <div className={css(styles.AuthPage_hero)}>
                  <div className={css(styles.AuthPage_subheadline)}>
                    {isLogin ? loginHeadline : signupHeadline}
                  </div>
                </div>
                <div className={css(styles.AuthPage_innerLeftPane)}>
                  {lineItems.map((lineItem, i) => {
                    return (
                      <div key={`lineItem-${i}`} className={css(styles.AuthPage_modalText)}>
                        <span><img src={verifiedPartnerIcon} /></span><div className={css(styles.AuthPage_lineItem)}>{lineItem}</div>
                      </div>
                    )
                  })}
                </div>
                <div className={css(styles.AuthPage_innerRightPane)}>
                  <div className={css(styles.AuthPage_signupPanel)}>
                    <Form onSubmit={isLogin ? this.handleLogin : this.handleRegister} error={hasErrors}>
                      <Message
                        error
                      >
                        <Message.Header>{isLogin ? "Login invalid" : "Registration invalid"}</Message.Header>
                        <p>{isLogin ? "That doesn’t look like the right password. Give it another try or select \"Forgot Password\" below" : "That doesn’t look right. Give it another try. Fill in all fields and password must be at least 6 characters."}</p>
                      </Message>
                      {!isLogin &&
                        <>
                          <Form.Field className={css(styles.AuthPage_formField, styles.AuthPage_firstNameField)}>
                            <input
                              className={css(styles.AuthPage_inputField)}
                              name='firstName'
                              value={firstName}
                              placeholder='First Name'
                              onChange={this.handleChange}
                            />
                          </Form.Field>
                          <Form.Field className={css(styles.AuthPage_formField, styles.AuthPage_lastNameField)}>
                            <input
                              className={css(styles.AuthPage_inputField)}
                              name='lastName'
                              value={lastName}
                              placeholder='Last Name'
                              onChange={this.handleChange}
                            />
                          </Form.Field>
                          {isCompany &&
                            <Form.Field className={css(styles.AuthPage_formField, styles.AuthPage_companyField)}>
                              <Dropdown
                                className={css(styles.AuthPage_dropdown)}
                                placeholder='Company Name'
                                icon={null}
                                fluid
                                selection
                                allowAdditions
                                additionLabel='Other Company: '
                                onAddItem={this.handleAddition}
                                search
                                options={companyOptions}
                                onChange={this.handleCompany}
                              />
                            </Form.Field>}
                        </>
                      }
                      <Form.Field className={css(styles.AuthPage_formField)}>
                        <input
                          className={css(styles.AuthPage_inputField)}
                          name='email'
                          value={email}
                          placeholder='E-mail'
                          onChange={this.handleChange}
                        />
                      </Form.Field>
                      <Form.Field className={css(styles.AuthPage_formField)}>
                        <input
                          className={css(styles.AuthPage_inputField)}
                          name='password'
                          value={password}
                          type="password"
                          placeholder='Password'
                          onChange={this.handleChange}
                        />
                      </Form.Field>
                      <Button
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className={css(styles.AuthPage_submitButton)}
                        type='submit'
                      >
                        {isLogin ? "Sign in" : "Create Account"}
                      </Button>
                    </Form>
                    <div className={css(styles.AuthPage_forgotPasswordContainer)}>
                      {!isLogin && <div className={css(styles.AuthPage_footerText)}>By signing up you agree to the </div>}
                      {isLogin ? (
                        <a
                          className={css(styles.AuthPage_forgotPassword)}
                          href="/users/password/new"
                        >
                          Forgot password?
                        </a>
                      ) : (
                        <a
                          className={css(styles.AuthPage_forgotPassword)}
                          href="/terms"
                          target="_blank"
                        >
                          Terms of Service
                        </a>
                      )}
                      {!isLogin && <span className={css(styles.AuthPage_footerText)}>{' & '}</span>}
                      {!isLogin &&
                        <a
                          className={css(styles.AuthPage_forgotPassword)}
                          href="/privacy_policy"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>}
                    </div>
                  </div>
                </div>
                <hr className={css(styles.AuthPage_horizontalRule)}/>
              <div className={css(styles.AuthPage_alreadyHaveAccount)}>
                  {isLogin ? "Don’t have an account?" : "Already have an account?"}
                  <span style={{ marginLeft: '2px' }}>
                    <a className={css(styles.AuthPage_signInLink)} href={switchLink}>{isLogin ? "Sign up" : "Sign in"}</a>
                  </span>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className={css(styles.AuthPage_container)}>
          <div className={css(styles.AuthPage_backgroundPane, isScientist && styles.AuthPage_scientist_backgroundImage)} />
        </div>
      </div>
    );
  }
}

AuthPage.defaultProps = {
  lineItems: [],
  loginHeadline: '',
  signupHeadline: '',
  isLogin: false,
  switchLink: '',
  isCompany: false,
  isUniversity: false,
  isScientist: false,
}

AuthPage.propTypes = {
  lineItems: PropTypes.array,
  loginHeadline: PropTypes.string,
  signupHeadline: PropTypes.string,
  isLogin: PropTypes.bool,
  switchLink: PropTypes.string,
  isCompany: PropTypes.bool,
  isUniversity: PropTypes.bool,
};

export default AuthPage;
