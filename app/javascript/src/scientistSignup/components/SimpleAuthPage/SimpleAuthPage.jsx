import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { Container, Grid, Button, Form, Input, Message } from 'semantic-ui-react'
import Validator from 'validator';
import axios from 'axios';

import { COLORS, WINDOW_DIMENSIONS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import signUpGraphic from '../../../../images/backgrounds/scientist-background.png';
import { authenticityToken, getCookie } from '../../../marketplace/utils/requests';

const { TABLET_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  SimpleAuthPage_container: {
    height: '100%',
    paddingBottom: '1px',
  },
  SimpleAuthPage_backgroundPane: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    position: 'absolute',
    backgroundColor: COLORS.darkBlue,
    backgroundImage: `url(${signUpGraphic})`,
    backgroundSize: 'cover',
    zIndex: -100,
  },
  SimpleAuthPage_innerContainer: {
    backgroundColor: 'white',
    margin: '20px auto',
    padding: '20px',
    maxWidth: '40%',
    [TABLET_MEDIA_QUERY]: {
      maxWidth: '95%',
    },
  },
  SimpleAuthPage_grid: {

  },
  SimpleAuthPage_logoContainer: {
    marginTop: '25px',
    textAlign: 'center',
  },
  SimpleAuthPage_hero: {
    marginTop: '20px',
  },
  SimpleAuthPage_headline: {
    color: COLORS.lightBlack,
    fontSize: '36px',
    fontWeight: 'bold',
    lineHeight: '48px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  SimpleAuthPage_subheadline: {
    color: COLORS.darkGray,
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  SimpleAuthPage_innerRightPane: {
    width: '100%',
  },
  SimpleAuthPage_signupPanel: {

  },
  SimpleAuthPage_footerText: {
    color: COLORS.lightBlack,
    fontSize: '13px',
  },
  SimpleAuthPage_alreadyHaveAccount: {
    textAlign: 'center',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: 'bold',
    lineHeight: '24px',
    color: COLORS.lightBlack,
  },
  SimpleAuthPage_signInLink: {
    fontWeight: 'normal',
    textDecoration: 'underline',
    color: COLORS.lightBlack,
    cursor: 'pointer',
  },
  SimpleAuthPage_label: {
    display: 'block',
    color: COLORS.darkGray,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
  },
  SimpleAuthPage_inputField: {
    width: '100%',
    border: `1px solid ${COLORS.lightGray}`,
    padding: '5px 12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
  },
  SimpleAuthPage_submitButton: {
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
  SimpleAuthPage_formField: {
    marginTop: '15px',
    marginBottom: '15px',
  },
  SimpleAuthPage_forgotPasswordContainer: {
    textAlign: 'center',
    marginTop: '10px',
  },
  SimpleAuthPage_forgotPassword: {
    textDecoration: 'underline',
    color: COLORS.darkGray,
    fontSize: '13px',
    lineHeight: '24px',
  },
  SimpleAuthPage_horizontalRule: {
    marginTop: '16px',
    marginBottom: '16px',
  },
});

class SimpleAuthPage extends PureComponent {
  state = {
    password: '',
    email: '',
    isSubmitting: false,
    hasSubmitted: false,
    error: '',
    errors: {},
  };

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
    const { email, password } = this.state;

    this.setState({
      isSubmitting: true,
      error: '',
      hasSubmitted: true,
    });

    try {
      const responseJson = await axios.post('/users/sign_in',
        {
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
        }
      );
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
      const { email } = this.state;

      const portalID = '6895929';

      // Scientist Registration
      let formID = '5fb3e11f-bf56-4b75-9a0b-632e5888e33f';

      // https://developers.hubspot.com/docs/methods/forms/submit_form_v3
      const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalID}/${formID}`;

      try {
        await axios.post(url, {
          fields: [
            { name: 'email', value: email },
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
    const { email, password } = this.state;

    this.setState({
      isSubmitting: true,
      errors: {},
      hasSubmitted: true,
    });

    try {
      const responseJson = await axios.post('/users',
        {
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
        }
      );

      await this.submitToHubspot();

      window.location.href = '/redirect_login';
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
      isSubmitting,
      hasSubmitted,
      error,
      errors,
    } = this.state;
    const { isLogin, switchLink } = this.props;

    const hasErrors = hasSubmitted && (error.length > 0 || Object.keys(errors).length > 0);
    const errorKey = errors && Object.keys(errors).length > 0 && Object.keys(errors)[0];
    const registrationError = errorKey && Object.keys(errors).length > 0 && `${errorKey}: ${errors[errorKey]}`;

    return (
      <div>
        <div className={css(styles.SimpleAuthPage_container)}>
          <div className={css(styles.SimpleAuthPage_backgroundPane)} />
        </div>
        <div className={css(styles.SimpleAuthPage_innerContainer)}>
          <div className={css(styles.SimpleAuthPage_logoContainer)}>
            <a href="/">
              <img src={haloLogo} />
            </a>
          </div>
          <Grid centered columns={2} className={css(styles.SimpleAuthPage_grid)}>
            <Grid.Row centered columns={2}>
              <Grid.Column width={15}>
                <div className={css(styles.SimpleAuthPage_hero)}>
                  <div className={css(styles.SimpleAuthPage_headline)}>
                    {isLogin ? "Welcome Back!" : "Move Science Forward"}
                  </div>
                  <div className={css(styles.SimpleAuthPage_subheadline)}>
                    {isLogin ? "Sign in to keep your profile current and stay up-to-date on the newest opportunities to work with industry" : "Join a network of scientists and partners in search of opportunities to collaborate"}
                  </div>
                </div>
                <div className={css(styles.SimpleAuthPage_innerRightPane)}>
                  <div className={css(styles.SimpleAuthPage_signupPanel)}>
                    <Form onSubmit={isLogin ? this.handleLogin : this.handleRegister} error={hasErrors}>
                      <Message
                        error
                      >
                        <Message.Header>{isLogin ? "Login invalid" : "Registration invalid"}</Message.Header>
                        <p>{isLogin ? "That doesn’t look like the right password. Give it another try or select \"Forgot Password\" below" : "That doesn’t look right. Give it another try. Fill in all fields and password must be at least 6 characters."}</p>
                      </Message>
                      <Form.Field className={css(styles.SimpleAuthPage_formField)}>
                        <input
                          className={css(styles.SimpleAuthPage_inputField)}
                          name='email'
                          value={email}
                          placeholder='E-mail'
                          onChange={this.handleChange}
                        />
                      </Form.Field>
                      <Form.Field className={css(styles.SimpleAuthPage_formField)}>
                        <input
                          className={css(styles.SimpleAuthPage_inputField)}
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
                        className={css(styles.SimpleAuthPage_submitButton)}
                        type='submit'
                      >
                        {isLogin ? "Sign in" : "Create Account"}
                      </Button>
                    </Form>
                    <div className={css(styles.SimpleAuthPage_forgotPasswordContainer)}>
                      {!isLogin && <span className={css(styles.SimpleAuthPage_footerText)}>By signing up you agree to the </span>}
                      {isLogin ? (
                        <a
                          className={css(styles.SimpleAuthPage_forgotPassword)}
                          href="/users/password/new"
                        >
                          Forgot password?
                        </a>
                      ) : (
                        <a
                          className={css(styles.SimpleAuthPage_forgotPassword)}
                          href="/terms"
                          target="_blank"
                        >
                          Terms of Service
                        </a>
                      )}
                      {!isLogin && <span className={css(styles.SimpleAuthPage_footerText)}>{' & '}</span>}
                      {!isLogin &&
                        <a
                          className={css(styles.SimpleAuthPage_forgotPassword)}
                          href="/privacy_policy"
                        >
                          Privacy Policy
                        </a>}
                      <hr className={css(styles.SimpleAuthPage_horizontalRule)} />
                      <div className={css(styles.SimpleAuthPage_alreadyHaveAccount)}>
                        {isLogin ? "Don’t have an account?" : "Already have an account?"}
                        <span style={{ marginLeft: '5px' }}>
                          <a className={css(styles.SimpleAuthPage_signInLink)} href={switchLink}>{isLogin ? "Sign up" : "Sign in"}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default SimpleAuthPage;
