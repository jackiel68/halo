import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Button, Container, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import haloLogo from '../../../../images/logos/halo_logo.svg';
import {
  toggleLoginModal as toggleLoginModalAction,
} from '../../actions/profileActions';
import { COLORS, WINDOW_DIMENSIONS } from '../../../../constants';
import LoginModal from '../LoginModal';

const { LARGE_MEDIA_QUERY, TABLET_LANDSCAPE_MEDIA_QUERY, MOBILE_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  Navbar_menu: {
    position: 'relative',
    [MOBILE_MEDIA_QUERY]: {
      display: 'none'
    },
  },
  Navbar_fullscreenMenu: {
    position: 'absolute',
    zIndex: 10000,
    right: '0px',
    paddingLeft: '15px',
    paddingRight: '15px',
    [LARGE_MEDIA_QUERY]: {
      paddingLeft: '80px',
      paddingRight: '80px',
    },
    [MOBILE_MEDIA_QUERY]: {
      display: 'none'
    },
  },
  Navbar_inlineItem: {
    display: 'inline-block',
    margin: '30px',
    fontSize: '14px',
    lineHeight: '16px',
    color: COLORS.lightBlack,
  },
  Navbar_rightItem: {
    display: 'inline-block',
    margin: '30px 0 30px 30px',
  },
  Navbar_signin: {
    padding: '10px 35px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    fontSize: '15px',
    lineHeight: '18px',
  },
  Navbar_regularLink: {
    textDecoration: 'none',
    color: COLORS.lightBlack,
    cursor: 'pointer',
  },
  Navbar_rightMenu: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
  },
  Navbar_leftMenu: {
    width: '100%',
    float: 'left',
    display: 'inline-block',
    textAlign: 'left',
  },
  Navbar_accountPopup: {
    marginTop: '15px',
    marginBottom: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    border: 'none',
  },
  Navbar_popupProfilePic: {
    height: '80px',
    width: '80px',
    backgroundColor: COLORS.transparentDarkGray,
    borderRadius: '40px',
    marginLeft: '20px',
  },
  Navbar_regularProfilePic: {
    height: '80px',
    width: '80px',
    backgroundColor: COLORS.transparentDarkGray,
    borderRadius: '40px',
    marginLeft: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
  },
  Navbar_menuProfilePic: {
    height: '36px',
    width: '36px',
    backgroundColor: COLORS.transparentDarkGray,
    borderRadius: '40px',
    marginRight: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
  },
  Navbar_menuWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  Navbar_popupRightPanel: {
    marginLeft: '20px',
    width: '65%',
    marginTop: '8px',
  },
  Navbar_popupName: {
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '18px',
    textTransform: 'capitalize',
  },
  Navbar_popupPosition: {
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '28px',
    color: COLORS.darkGray,
  },
  Navbar_popupContainer: {
    display: 'flex',
    marginBottom: '8px',
  },
  Navbar_signOutButton: {
    padding: '15px 20px',
    fontSize: '13px',
    backgroundColor: COLORS.trueGray,
    color: COLORS.gray,
    marginBottom: '0px',
    width: '300px',
    borderRadius: '0px',
    marginRight: '0',
    textAlign: 'left',
  },
  Navbar_accountButton: {
    padding: '15px 20px',
    backgroundColor: COLORS.trueGray,
    borderBottom: `1px solid ${COLORS.lightGray}`,
    fontSize: '13px',
    color: COLORS.gray,
    marginTop: '10px',
    width: '300px',
    borderRadius: '0px',
    marginRight: '0',
    textAlign: 'left',
  },
  Navbar_publicProfileButton: {
    padding: '15px 20px',
    backgroundColor: COLORS.trueGray,
    borderBottom: `1px solid ${COLORS.lightGray}`,
    fontSize: '13px',
    color: COLORS.gray,
    width: '300px',
    borderRadius: '0px',
    marginRight: '0',
    textAlign: 'left',
  },
  Navbar_profileButton: {
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.lightBlue,
  },
  Navbar_accountPopupContainer: {
    width: '300px',
    padding: `10px 0px 0`,
    zIndex: 2000,
  },
  Navbar_profilePicContainer: {
    width: '35%',
  },
  Navbar_userName: {
    display: 'inline-block',
    fontSize: '14px',
    marginRight: '10px',
    color: COLORS.lightBlack,
  },
  Navbar_userIcon: {
    display: 'inline-block',
  },
  Navbar_newRFPButton: {
    padding: '12px 30px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
  },
  Navbar_activeLink: {
    textDecoration: 'none',
    color: COLORS.haloBlue,
    cursor: 'pointer',
  },
});

class Navbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accountDropdownOpen: false,
    };
  }

  navigateToLogin = () => {
    window.location.href = '/login';
  };

  navigateToLogout = () => {
    window.location.href = '/sign_out';
  };

  navigateToProfile = () => {
    window.location.href = `/profile/${gon.current_user.profile_id}`;
  };

  navigateToAccount = () => {
    window.location.href = '/account';
  }

  navigateToDashboard = () => {
    window.location.href = '/reviewer_dashboard';
  }

  navigateToPublicProfile = () => {
    window.location.href = `/profile/${gon.current_user.profile_id}?public=true`;
  }

  render() {
    const {
      path,
      toggleLoginModal,
      noSidebar,
    } = this.props;
    const {
      accountDropdownOpen,
    } = this.state;
    const isStartingPage = path === "/marketplace";
    const isReviewerDashboard = path.startsWith("/reviewer_dashboard");
    const isReviewDashboardProposals = path.startsWith("/reviewer_dashboard/proposals");
    const currentUser = gon.current_user;

    let currentPFPic;
    if (currentUser && currentUser.image && currentUser.image.medium) {
      currentPFPic = currentUser.image.medium.url;
    } else {
      currentPFPic = gon.default_pf_image;
    }

    return (
      <div className={css(noSidebar ? styles.Navbar_fullscreenMenu : styles.Navbar_menu)}>
        <div className={css(styles.Navbar_rightMenu)}>
          <LoginModal
            startOnLogin={false}
            signupHeadline={"Find funding opportunities from industry and bring your ideas to life"}
            lineItems={[
              "Submit a pre-proposal in less than an hour.",
              "Receive feedback directly from the industry contact.",
              "Get discovered by industry partners looking for your expertise."
            ]}
          />
          {/*{!isStartingPage && (gon.current_user && gon.current_user.role !== 1) &&
            <div className={css(styles.Navbar_inlineItem)}>
              <a className={css(styles.Navbar_regularLink)} href="/marketplace">
                Find collaborations
              </a>
            </div>}*/}
          {!isReviewerDashboard && (gon.current_user && gon.current_user.role === 1) &&
            <div className={css(styles.Navbar_inlineItem)}>
              <a className={css(styles.Navbar_regularLink)} href="/reviewer_dashboard">
                Reviewer Dashboard
              </a>
            </div>}
          {!gon.current_user &&
            <div className={css(styles.Navbar_inlineItem)}>
              <a className={css(styles.Navbar_regularLink)} href="/universities/register">
                Become a university partner
              </a>
            </div>}
          <div className={css(styles.Navbar_rightItem)}>
            {!gon.current_user ? (
              <div onClick={() => toggleLoginModal(true)}>
                <Button className={css(styles.Navbar_signin)}>
                  Sign up
                </Button>
              </div>
            ) : (
              <Popup
                trigger={
                  <div className={css(styles.Navbar_menuWrap)}>
                    {currentPFPic === gon.default_pf_image && currentUser.first_name && currentUser.last_name ? (

                      <div className={css(styles.Navbar_menuProfilePic)}>
                        {currentUser.first_name[0].toUpperCase()}{currentUser.last_name[0].toUpperCase()}
                      </div>

                    ) : (

                      <div
                        className={css(styles.Navbar_menuProfilePic)}
                        style={{
                          backgroundImage: `url(${gon.current_user && gon.current_user.image.small.url})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center center',
                        }}
                      />
                    )}

                    <Icon
                      size="small"
                      name="chevron down" />
                  </div>
                }
                on="click"
                basic
                className={`${css(styles.Navbar_accountPopup)} transition-fadein`}
                hideOnScroll
                hoverable
                position="bottom center"
                open={accountDropdownOpen}
                onOpen={() => {
                  this.setState({
                    accountDropdownOpen: true,
                  })
                }}
                onClose={() => this.setState({ accountDropdownOpen: false })}
                content={
                  <div
                    className={css(styles.Navbar_accountPopupContainer)}
                    onMouseEnter={() => this.setState({ accountDropdownOpen: true })}
                    onMouseLeave={() => this.setState({ accountDropdownOpen: false })}
                  >
                    <div className={css(styles.Navbar_popupContainer)}>
                      <div className={css(styles.Navbar_profilePicContainer)}>
                        {currentPFPic === gon.default_pf_image && currentUser.first_name && currentUser.last_name ? (
                          <div
                            className={css(styles.Navbar_regularProfilePic)}
                          >
                            {currentUser.first_name[0].toUpperCase()}{currentUser.last_name[0].toUpperCase()}
                          </div>
                        ) : (
                          <div
                            className={css(styles.Navbar_popupProfilePic)}
                            style={{
                              backgroundImage: `url(${gon.current_user && gon.current_user.image.medium.url})`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center center',
                            }}
                          />
                        )}
                      </div>
                      <div className={css(styles.Navbar_popupRightPanel)}>
                        <div className={css(styles.Navbar_popupName)}>
                          {gon.current_user.name}
                        </div>
                        <div className={css(styles.Navbar_popupPosition)}>
                          {gon.current_user.role === 1 ? gon.current_user.company.company_name : gon.current_user.title}
                        </div>
                        {gon.current_user.role === 0 &&
                          <div>
                            <div onClick={this.navigateToProfile} className={css(styles.Navbar_profileButton)}>Edit Profile</div>
                          </div>}
                        {gon.current_user.role === 1 &&
                          <div>
                            <div onClick={this.navigateToDashboard} className={css(styles.Navbar_profileButton)}>View Dashboard</div>
                          </div>}
                      </div>
                    </div>
                    <Button onClick={this.navigateToAccount} className={css(styles.Navbar_accountButton)}>Account Settings</Button>
                    {gon.current_user.role === 0 && <Button onClick={this.navigateToPublicProfile} className={css(styles.Navbar_publicProfileButton)}>View Public Profile</Button>}
                    <Button onClick={this.navigateToLogout} className={css(styles.Navbar_signOutButton)}>Sign Out</Button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(null, mapDispatchToProps)(Navbar);
