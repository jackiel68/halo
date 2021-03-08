import React, { PureComponent } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { Container, Grid, Button, Form, Input, Message, Modal } from 'semantic-ui-react'
import Validator from 'validator';

import { COLORS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import signUpGraphic from '../../../../images/backgrounds/sign_up_graphic.svg';
import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import {
  toggleLoginModal as toggleLoginModalAction,
} from '../../actions/profileActions';
import {
  authenticityToken,
  getCookie,
} from '../../utils/requests';

const styles = StyleSheet.create({
  LoginModal_modal: {

  },
  LoginModal_container: {
    height: '100%',
    paddingBottom: '1px',
  },
  LoginModal_backgroundPane: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    position: 'absolute',
    backgroundColor: COLORS.darkBlue,
    backgroundImage: `url(${signUpGraphic})`,
    backgroundSize: 'cover',
    zIndex: -100,
  },
  LoginModal_innerContainer: {
    backgroundColor: 'white',
    padding: '10px',
    margin: '1.5em auto'
  },
  LoginModal_grid: {

  },
  LoginModal_logoContainer: {
    marginTop: '25px',
    textAlign: 'center',
  },
  LoginModal_hero: {
    marginTop: '40px',
  },
  LoginModal_headline: {
    color: COLORS.lightBlack,
    fontSize: '36px',
    fontWeight: 'bold',
    lineHeight: '48px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  LoginModal_firstNameField: {
    marginBottom: '0',
    marginRight: '4%',
    width: '48%',
    display: 'inline-block',
  },
  LoginModal_lastNameField: {
    marginBottom: '0',
    width: '48%',
    display: 'inline-block',
  },
  LoginModal_subheadline: {
    color: COLORS.darkGray,
    fontSize: '18px',
    lineHeight: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  LoginModal_innerLeftPane: {
    width: '50%',
    display: 'inline-block',
    verticalAlign: 'top',
    padding: '30px 10px 30px 0',
  },
  LoginModal_innerRightPane: {
    width: '50%',
    display: 'inline-block',
  },
  LoginModal_signupPanel: {

  },
  LoginModal_orcidButton: {
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    padding: '12px',
    width: '100%',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  LoginModal_alreadyHaveAccount: {
    textAlign: 'center',
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: 'bold',
    lineHeight: '24px',
    width: '100%',
    color: COLORS.lightBlack,
  },
  LoginModal_signInLink: {
    marginLeft: '5px',
    display: 'inline-block',
    fontWeight: 'normal',
    textDecoration: 'none',
    color: COLORS.lightBlack,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  LoginModal_label: {
    display: 'block',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
  },
  LoginModal_footerText: {
    color: COLORS.lightBlack,
    fontSize: '12px',
  },
  LoginModal_inputField: {
    width: '100%',
    border: `1px solid ${COLORS.lightGray}`,
    padding: '5px 12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  LoginModal_submitButton: {
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
  LoginModal_formField: {
    marginTop: '15px',
    marginBottom: '15px',
  },
  LoginModal_forgotPasswordContainer: {
    textAlign: 'center',
    marginTop: '10px',
  },
  LoginModal_forgotPassword: {
    textDecoration: 'underline',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '24px',
  },
  LoginModal_modalText: {
    color: COLORS.lightBlack,
    fontSize: '16px',
    width: '90%',
    marginBottom: '30px',
    display: 'flex',
  },
  LoginModal_lineItem: {
    marginLeft: '5px',
  },
  LoginModal_horizontalRule: {
    marginTop: '20px',
    marginBottom: '16px',
  },
});

class LoginModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      isSubmitting: false,
      hasSubmitted: false,
      isLogin: props.startOnLogin,
      error: '',
      errors: undefined,
    };
  }

  openORCID = (e) => {
    e.preventDefault();
    const clientId = process.env.ORCID_CLIENT_ID;

    window.open(
      `https://${process.env.ORCID_URL}/oauth/authorize?client_id=${process.env.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${process.env.ORCID_REDIRECT}`,
      "_blank",
      "toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500");
  };

  handleChange = (e) => {
    this.setState({
      hasSubmitted: false,
      [e.target.name]: e.target.value,
    });
  };

  handleLogin = async () => {
    const { toggleLoginModal } = this.props;
    const { email, password } = this.state;

    this.setState({
      isSubmitting: true,
      error: '',
      hasSubmitted: true,
    });

    try {
      const responseJson = await axios.post('/users/sign_in', {
        user: {
          email,
          password,
        },
      },
      {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });

      toggleLoginModal(false);
      window.location.reload();
    } catch(error) {
      this.setState({
        isSubmitting: false,
        error: error.response.data.error
      });
    }
  };

  submitToHubspot = async () => {
    if (window.location.host.includes("halocures.com")) {
      const { email, firstName, lastName } = this.state;

      const portalID = '6895929';

      // Scientist Registration
      let formID = '5fb3e11f-bf56-4b75-9a0b-632e5888e33f';

      // https://developers.hubspot.com/docs/methods/forms/submit_form_v3
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalID}/${formID}`;

      try {
        await axios.post(url, {
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: firstName },
            { name: 'lastname', value: lastName },
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
    const { email, password, firstName, lastName } = this.state;
    const { toggleLoginModal } = this.props;

    this.setState({
      isSubmitting: true,
      errors: {},
      hasSubmitted: true,
    });

    try {
      const responseJson = await axios.post('/users', {
        user: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }
      },
      {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });

      toggleLoginModal(false);
      await this.submitToHubspot();

      window.location.reload();
    } catch(error) {
      this.setState({
        isSubmitting: false,
        errors: error.response.data.errors
      });
    }
  };

  render() {
    const {
      email,
      password,
      firstName,
      lastName,
      isSubmitting,
      hasSubmitted,
      error,
      isLogin,
      errors,
    } = this.state;
    const {
      toggleLoginModal,
      loginModalOpen,
      startPage,
      signupHeadline,
      loginHeadline,
      lineItems,
    } = this.props;

    const hasErrors = hasSubmitted && ((error && error.length > 0) || (errors && Object.keys(errors).length > 0));

    return (
      <Modal
        open={loginModalOpen}
        onClose={() => { toggleLoginModal(false) }}
        size="small"
        className={css(styles.LoginModal_modal)}
      >
        <div className={css(styles.LoginModal_innerContainer)}>
          <div className={css(styles.LoginModal_logoContainer)}>
            <a href="/">
              <img src={haloLogo} />
            </a>
          </div>
          <Grid centered columns={2} className={css(styles.LoginModal_grid)}>
            <Grid.Row centered columns={2}>
              <Grid.Column width={15}>
                <div className={css(styles.LoginModal_hero)}>
                  <div className={css(styles.LoginModal_subheadline)}>
                    {isLogin ? loginHeadline : signupHeadline}
                  </div>
                  {!isLogin &&
                    <div className={css(styles.LoginModal_subheadline)}>
                      <a href="/universities/register">Not a scientist? Sign up as a university partner</a>
                    </div>}
                </div>
                <div className={css(styles.LoginModal_innerLeftPane)}>
                  {lineItems.map((lineItem, i) => {
                    return (
                      <div key={`lineItem-${i}`} className={css(styles.LoginModal_modalText)}>
                        <span><img src={verifiedPartnerIcon} /></span><div className={css(styles.LoginModal_lineItem)}>{lineItem}</div>
                      </div>
                    )
                  })}
                </div>
                <div className={css(styles.LoginModal_innerRightPane)}>
                  <div className={css(styles.LoginModal_signupPanel)}>
                    <Form onSubmit={isLogin ? this.handleLogin : this.handleRegister} error={hasErrors}>
                      <Message
                        error
                      >
                        <Message.Header>{isLogin ? "Login invalid" : "Registration invalid"}</Message.Header>
                        <p>{isLogin ? "Something went wrong, please check password and try again." : "That account may already be taken or password is not long enough, please try logging in or try registering with another email."}</p>
                      </Message>
                      {!isLogin &&
                        <>
                          <Form.Field className={css(styles.LoginModal_formField, styles.LoginModal_firstNameField)}>
                            <input
                              className={css(styles.LoginModal_inputField)}
                              name='firstName'
                              value={firstName}
                              placeholder='First Name'
                              onChange={this.handleChange}
                            />
                          </Form.Field>
                          <Form.Field className={css(styles.LoginModal_formField, styles.LoginModal_lastNameField)}>
                            <input
                              className={css(styles.LoginModal_inputField)}
                              name='lastName'
                              value={lastName}
                              placeholder='Last Name'
                              onChange={this.handleChange}
                            />
                          </Form.Field>
                        </>}
                      <Form.Field className={css(styles.LoginModal_formField)}>
                        <input
                          className={css(styles.LoginModal_inputField)}
                          name='email'
                          value={email}
                          placeholder='E-mail'
                          onChange={this.handleChange}
                        />
                      </Form.Field>
                      <Form.Field className={css(styles.LoginModal_formField)}>
                        <input
                          className={css(styles.LoginModal_inputField)}
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
                        className={css(styles.LoginModal_submitButton)}
                        type='submit'
                      >
                        {isLogin ? "Sign in" : "Create Account"}
                      </Button>
                    </Form>
                    <div className={css(styles.LoginModal_forgotPasswordContainer)}>
                      {!isLogin && <div className={css(styles.LoginModal_footerText)}>By signing up you agree to the </div>}
                      {isLogin ? (
                        <a
                          className={css(styles.LoginModal_forgotPassword)}
                          href="/users/password/new"
                        >
                          Forgot password?
                        </a>
                      ) : (
                        <a
                          className={css(styles.LoginModal_forgotPassword)}
                          href="/terms"
                          target="_blank"
                        >
                          Terms of Service
                        </a>
                      )}
                      {!isLogin && <span className={css(styles.LoginPage_footerText)}>{' & '}</span>}
                      {!isLogin &&
                        <a
                          className={css(styles.LoginModal_forgotPassword)}
                          href="/privacy_policy"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>}
                    </div>
                  </div>
                </div>
                <hr className={css(styles.LoginModal_horizontalRule)}/>
                <div className={css(styles.LoginModal_alreadyHaveAccount)}>
                  {isLogin ? "Don’t have an account?" : "Already have an account?"}
                  <span>
                    <div className={css(styles.LoginModal_signInLink)} onClick={() => this.setState({ isLogin: !this.state.isLogin, errors: {}, error: undefined })}> {isLogin ? "Sign up" : "Sign in"}</div>
                  </span>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Modal>
    );
  }
}

LoginModal.defaultProps = {
  startOnLogin: false,
  loginHeadline: "Enter your details below to sign in.",
  lineItems: [],
};

const mapStateToProps = (state) => {
  return {
    loginModalOpen: state.profiles.loginModalOpen,
  };
};

const mapDispatchToProps = {
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginModal);
