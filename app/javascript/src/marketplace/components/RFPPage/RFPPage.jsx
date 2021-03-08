import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { css, StyleSheet } from 'aphrodite';
import { Container, Button, Grid } from 'semantic-ui-react';

import { COLORS, ICONS, WINDOW_DIMENSIONS } from '../../../../constants';
import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import heartIcon from '../../../../images/icons/heart.svg';
import filledHeartIcon from '../../../../images/icons/filled_heart.svg';
import backgroundImage from '../../../../images/backgrounds/droplet-background.svg';
import beanImage from '../../../../images/backgrounds/bean.svg';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import {
  saveRFP as saveRFPAction,
  unsaveRFP as unsaveRFPAction,
  updateCurrentRFP as updateCurrentRFPAction,
} from '../../actions/defaultActions';
import {
  toggleLoginModal as toggleLoginModalAction,
} from '../../actions/profileActions';
import { transformText } from '../../utils/textUtils';

import InviteFacultyModal from './InviteFacultyModal';
import ComingSoonModal from './ComingSoonModal';
// import WelcomeUniversityModal from './WelcomeUniversityModal';

const { TABLET_LANDSCAPE_MEDIA_QUERY, MOBILE_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  RFPPage_container: {
    width: '85%',
    margin: 'auto',
    zIndex: '1000',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '90%',
    },
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      padding: '16px'
    },
  },
  RFPPage_company: {
    background: COLORS.haloGray,
    height: '511px',
    position: 'relative',
    overflow: 'hidden',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      paddingLeft: '30px',
      textAlign: 'left',
      height: '450px',
    },
    [MOBILE_MEDIA_QUERY]: {
      padding: '0 24px',
      background: COLORS.white,
      height: 'unset',
    },
  },
  RFPPage_companyLink: {
    color: COLORS.haloBlack,
    fontSize: '20px',
    lineHeight: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    [MOBILE_MEDIA_QUERY]: {
      display: 'block',
      fontSize: '16px',
    },
  },
  RFPPage_title: {
    color: COLORS.haloBlack,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 'bold',
    fontSize: '36px',
    lineHeight: '48px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      fontSize: '24px',
      lineHeight: '24px',
      marginTop: '20px',
      marginBottom: '20px',
    },
    [MOBILE_MEDIA_QUERY]: {
      fontWeight: '600',
      fontSize: '24px',
      lineHeight: '36px',
      margin: '5px 0'
    },
  },
  RFPPage_summary: {
    color: COLORS.haloBlack,
    fontSize: '20px',
    lineHeight: '30px',
    marginTop: '50px',
    marginBottom: '0px',
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '16px',
    },
  },
  RFPPage_bulletList: {
    marginLeft: '15px',
    marginBottom: '2em',
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
  },
  SubmitProposal_bulletPoint: {
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '14px',
    },
  },
  RFPPage_regularFont: {
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
    marginBottom: '2em',
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '14px',
    },
  },
  RFPPage_miniSectionHeader: {
    fontWeight: 'bold',
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
    marginBottom: '20px',
  },
  RFPPage_deadline: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '24px',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: COLORS.lightGray,
    marginBottom: '16px',
  },
  RFPPage_submitButton: {
    width: '300px',
    maxWidth: '90%',
    height: '48px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    border: `1px solid ${COLORS.lightBlue}`,
    borderRadius: '4px',
    padding: '8px 30px',
    color: COLORS.white,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '16px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      maxWidth: 'unset'
    },
  },
  RFPPage_shareButton: {
    backgroundColor: COLORS.snowWhite,
    border: `1px solid ${COLORS.gray}`,
    borderRadius: '4px',
    padding: '8px 20px',
    color: COLORS.gray,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '13px',
    marginRight: '8px',
    marginLeft: '8px',
  },
  RFPPage_saveButton: {
    color: COLORS.haloBlue,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '16px',
    marginTop: '25px',
    textAlign: 'center',
  },
  RFPPage_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  RFPPage_section: {
    marginBottom: '30px',
  },
  RFPPage_verifiedIconContainer: {
    display: 'inline-block',
  },
  RFPPage_verifiedIcon: {
    display: 'inline-block',
    marginLeft: '5px',
    marginRight: '5px',
    [MOBILE_MEDIA_QUERY]: {
      marginLeft: '0',
      height: '25px',
      position: 'absolute',
      top: '-1px',
      left: '64px'
    },
  },
  RFPPage_verifiedIconText: {
    display: 'inline-block',
    color: COLORS.haloBlue,
    fontSize: '12px',
    lineHeight: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  RFPPage_tagContainer: {
    marginRight: '10px',
    width: '30%',
    minHeight: '204px',
    border: `1px solid ${COLORS.borderGray}`,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '90%',
      margin: 'auto',
      minHeight: '128px',
      marginBottom: '10px',
    },
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  RFPPage_tagText : {
    marginRight: '10px',
    display: 'inline-block',
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
  },
  RFPPage_tagDescription: {
    alignSelf: 'flex-end',
    margin: '0 24px',
    fontSize: '14px',
    lineHeight: '28px',
    color: COLORS.haloBlack,
    marginBottom: '20px',
  },
  RFPPage_tagType: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    margin: '24px 24px 14px',
  },
  RFPPage_subtitle: {
    fontWeight: 600,
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginRight: '16px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    [MOBILE_MEDIA_QUERY]: {
      fontWeight: 'normal',
    },
  },
  RFPPage_therapeuticArea: {
    fontWeight: 600,
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginRight: '16px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  RFPPage_innovationType: {
    fontWeight: 600,
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginRight: '16px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  RFPPage_innovationContainer: {
    width: '85%',
    margin: 'auto',
    top: '200px',
    position: 'relative',
    marginBottom: '12px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      left: 'auto',
      margin: '50px auto 12px',
      top: '100px',
      width: '90%',
    },
    [MOBILE_MEDIA_QUERY]: {
      marginLeft: '0px',
      width: '100%',
      marginTop: '95px',
      top: '0',
    },
  },
  RFPPage_backgroundImage: {
    position: 'absolute',
    width: '80%',
    height: '577px',
    left: '30%',
    top: '24px',
    mixedBlendMode: 'lighten',
    [MOBILE_MEDIA_QUERY]: {
      width: '116%',
      left: '12%',
      top: '-26%'
    },
  },
  RFPPage_backgroundImageRectangle: {
    position: 'absolute',
    left: '0px',
    top: '4px',
    width: '100%',
    height: '601px',
    background: 'linear-gradient(90.87deg, rgba(246, 248, 251, 0.15) 28.23%, rgba(246, 248, 251, 0.8) 99.65%)',
    mixBlendMode: 'normal',
    [MOBILE_MEDIA_QUERY]: {
      top: '70px',
      background: 'rgba(255, 255, 255, 0.7)'
    },
  },
  RFPPage_backgroundBean: {
    position: 'absolute',
    left: '20%',
    width: '80%',
    top: '-100px',
    [MOBILE_MEDIA_QUERY]: {
      display: 'none',
    }
  },
  RFPPage_mobileBean: {
    [MOBILE_MEDIA_QUERY]: {
      position: 'absolute',
      width: '360px',
      height: '150px',
      left: '55px',
      top: '165px',
      background: 'linear-gradient(90deg, #8D5FEE -1.25%, #63EEE6 100%)',
      opacity: '0.1',
      borderRadius: '700px',
      transform: 'rotate(-15deg)',
    },
  },
  RFPPage_majorSectionHeader: {
    marginTop: '50px',
    marginBottom: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '24px',
    color: COLORS.haloBlack,
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '18px',
      marginTop: '30px'
    },
  },
  RFPPage_submitProposalHeader: {
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '24px',
    color: COLORS.haloBlack,
  },
  RFPPage_companySectionHeader: {
    marginTop: '-10px',
    marginBottom: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '24px',
    color: COLORS.haloBlack,
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '18px',
    },
  },
  RFPPage_haloLogo: {
    position: 'absolute',
    width: '60px',
    height: '30px',
    left: '30px',
    top: '30px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      margin: 'auto',
      left: 'auto',
      position: 'relative',
    },
    [MOBILE_MEDIA_QUERY]: {
      width: '50px',
    },
  },
  RFPPage_horizontalRule: {
    marginTop: '45px',
    marginBottom: '45px',
    borderTop: '2px solid #E7EAEE',
  },
  RFPPage_resourceSection: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
  },
  RFPPage_tagIcon: {
    height: '48px',
    width: '48px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '16px',
    backgroundColor: COLORS.trueGray,
  },
  RFPPage_actionContainer: {
    width: 'fit-content',
    textAlign: 'center',
    margin: '75px 0',
    float: 'right',
    border: `2px solid ${COLORS.haloBlue}`,
    padding: '30px',
    borderRadius: '4px',
    backgroundColor: COLORS.white,
    width: '375px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      float: 'unset',
      width: '95%',
    },
    [MOBILE_MEDIA_QUERY]: {
      marginTop: '20px',
      marginBottom: '0px',
      width: '100%',
      padding: '30px 24px'
    },
  },
  RFPPage_signedOutContainer: {
    top: '30px',
    position: 'absolute',
    display: 'flex',
    right: '200px',
    zIndex: 100,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      top: '32px',
      display: 'inline-block',
      justifyContent: 'center',
      right: 'auto',
      width: '20%',
      textAlign: 'center',
    },
  },
  RFPPage_becomePartnerLink: {
    color: COLORS.haloBlack,
    cursor: 'pointer',
  },
  RFPPage_signinButton: {
    width: '150px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    border: `1px solid ${COLORS.lightBlue}`,
    borderRadius: '4px',
    padding: '8px 30px',
    textAlign: 'center',
    color: COLORS.white,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '16px',
    marginLeft: '50px',
    cursor: 'pointer',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      marginLeft: 'auto',
      margin: 'auto',
    },
  },
  RFPPage_heartIcon: {
    marginRight: '5px',
    cursor: 'pointer',
  },
  RFPPage_companyLogo: {
    position: 'absolute',
    top: '-10px',
    right: '0',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      position: 'relative',
      marginBottom: '30px',
    },
  },
  RFPPage_reviewerCardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      display: 'block',
    },
  },
  RFPPage_reviewerCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    width: '48%',
    border: `2px solid ${COLORS.borderGray}`,
    minHeight: '444px',
    borderRadius: '6px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '95%',
      margin: '0px auto 30px',
    },
    [MOBILE_MEDIA_QUERY]: {
      margin: '0px 0px 20px',
      width: '100%'
    },
  },
  RFPPage_titleSpacer: {
    [MOBILE_MEDIA_QUERY]: {
      height: '95px',
    },
  },
  RFPPage_companyDescription: {
    marginBottom: '30px',
  },
  RFPPage_reviewerDescription: {
    margin: '30px 24px',
    color: COLORS.haloBlack,
    fontSize: '16px',
  },
  RFPPage_reviewerPicture: {
    height: '180px',
    width: '135px',
    minWidth: '135px',
    marginRight: '16px',
    borderRadius: '0 0 0 6px',
  },
  RFPPage_reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    bottom: '0',
    alignSelf: 'flex-start',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  RFPPage_reviewerName: {
    fontSize: '18px',
    color: COLORS.black,
    fontWeight: 500,
  },
  RFPPage_reviewerPosition: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: '12px',
  },
  RFPPage_nameInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  RFPPage_bodyGrid: {
    display: 'block',
    marginLeft: '0',
    marginRight: '0',
  },
  RFPPage_mainCompanyImageContainer: {
    marginBottom: '60px',
    position: 'relative',
    left: '-20%',
    width: '120%',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      left: '-5%',
      width: '126%',
      marginBottom: '48px',
    },
    [MOBILE_MEDIA_QUERY]: {
      left: '-50px',
    },
  },
  RFPPage_mainCompanyImage: {
    position: 'relative',
    width: '100%',
  },
});

class RFPPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inviteFacultyModalOpen: false,
      welcomeUniversityModalOpen: false,
      universityName: '',
    };
  }
  componentDidMount() {
    const {
      match,
      updateCurrentRFP,
      toggleLoginModal,
    } = this.props;

    const foundRFP = _.find(gon.rfp_results, { identifier: match.params.proposal });
    updateCurrentRFP(foundRFP);
    window.scrollTo(0, 0);

    const urlParams = new URLSearchParams(window.location.search);
    const openLogin = urlParams.get('login');
    const university = urlParams.get('university') || urlParams.get('invite');
    if (openLogin && !gon.logged_in) {
      toggleLoginModal(true);
    } else if (university && university.length > 0) {
      this.setState({ welcomeUniversityModalOpen: true, universityName: decodeURI(university) });
    }
  }

  handleSave = async () => {
    const {
      savedRFPs,
      saveRFP,
      unsaveRFP,
      currentRFP,
      isUpdatingSaveRFP,
    } = this.props;

    if (isUpdatingSaveRFP[currentRFP.id]) {
      return;
    }

    if (savedRFPs[currentRFP.id]) {
      await unsaveRFP(currentRFP.id);
    } else {
      await saveRFP(currentRFP.id);
    }
  };

  redirectToSubmitProposal = () => {
    const {
      currentRFP,
    } = this.props;
    if (!currentRFP.company.is_partner) {
      if (currentRFP.company.url) {
        window.open(currentRFP.company.url, '_blank');
      }
    } else {
      if (gon.current_user && gon.current_user.role === 2) {
        // If University user
        this.setState({ inviteFacultyModalOpen: true });
      } else {
        window.location.href = `/submit_proposal/${currentRFP.identifier}`;
      }
    }
  };

  submitProposalButtonText = () => {
    const {
      currentRFP,
    } = this.props;
    if (currentRFP.company.is_partner) {
      if (gon.current_user && gon.current_user.role === 2) {
        // If University user
        return "Send to Faculty";
      }
      return "Easy Apply";
    } else {
      return "View Site";
    }
  }

  renderButtonIcon = () => {
    const { currentRFP } = this.props;
    if (currentRFP.company.is_partner) {
      if (gon.current_user && gon.current_user.role === 2) {
        return undefined;
      }

      const hasIncomplete = gon.incomplete_proposals.length;
      if (hasIncomplete){
        return <img style={{ marginRight: '5px' }} src={ICONS.warning} alt="tag icon" />;
      } else {
        return <img style={{ marginRight: '10px' }} src={ICONS.lightning} alt="tag icon" />;
      }
    } else {
      return undefined;
    }
  }

  redirectToCompanyURL = () => {
    const {
      currentRFP,
    } = this.props;
    window.location.href = `//${currentRFP.company.url}`;
  };

  renderActionContainer = () => {
    const {
      windowDimensions: {
        isTabletLandscape,
        hasScrolledBelowFold,
      },
      currentRFP,
      savedRFPs,
      toggleLoginModal,
    } = this.props;

    const isSaved = savedRFPs[currentRFP.id] || false;
    const hasIncompleteProposal = !_.isEmpty(gon.incomplete_proposals);

    let actionPosition;
    let actionRight;
    let actionTop;
    let actionMaxWidth;
    if (isTabletLandscape) {
      actionPosition = 'relative';
      actionMaxWidth = '100%';
      actionRight = '0%';
      actionTop = 'inherit';

    } else if (!isTabletLandscape && hasScrolledBelowFold) {
      actionPosition = 'fixed';
      actionMaxWidth = '32%';
      actionRight = '7.5%';
      actionTop = '0%';
    } else if (!isTabletLandscape && !hasScrolledBelowFold) {
      actionPosition = 'absolute';
      actionMaxWidth = '100%';
      actionRight = '0%';
      actionTop = 'inherit';
    }
    return (
      <Grid.Column width={isTabletLandscape ? 16 : 6} style={{ position: 'relative' }}>
        <div
          className={css(styles.RFPPage_actionContainer)}
          style={{
            position: actionPosition,
            right: actionRight,
            top: actionTop,
            maxWidth: actionMaxWidth,
            zIndex: 1000,
          }}
        >
          <div className={css(styles.RFPPage_submitProposalHeader)}>
            Submit Pre-Proposal
          </div>
          <div className={css(styles.RFPPage_deadline)}>
            Time ~ 1 Hour &nbsp;&nbsp;&nbsp; Deadline: {currentRFP.deadline ? moment(currentRFP.deadline).format('MMM D') : "Open-ended"}
          </div>
          <Button
            className={css(styles.RFPPage_submitButton)}
            onClick={() => {
              !gon.logged_in ? toggleLoginModal(true) : this.redirectToSubmitProposal()
            }}
          >
            {this.renderButtonIcon()} { hasIncompleteProposal ? 'Complete Proposal' : this.submitProposalButtonText() }
          </Button>
          <div
            className={css(styles.RFPPage_saveButton)}
            onClick={() => {
              !gon.logged_in ? toggleLoginModal(true) : this.handleSave()
            }}
          >
            <img className={css(styles.RFPPage_heartIcon)} src={isSaved ? filledHeartIcon : heartIcon} alt='heart' /> {isSaved ? "Unsave" : "Save"}
          </div>
        </div>
      </Grid.Column>
    );
  }

  render() {
    const {
      currentRFP,
      savedRFPs,
      toggleLoginModal,
      windowDimensions: {
        isTabletLandscape,
      },
    } = this.props;
    const {
      inviteFacultyModalOpen,
      welcomeUniversityModalOpen,
      universityName,
    } = this.state;

    if (!currentRFP) {
      return null;
    }

    return (
      <div>
        <ComingSoonModal
          open={false}
          isLoggedIn={gon.logged_in}
          currentUser={gon.current_user}
          requestForProposal={currentRFP}
        />

        <InviteFacultyModal
          requestForProposal={currentRFP}
          open={inviteFacultyModalOpen}
          closeInviteFacultyModal={() => { this.setState({ inviteFacultyModalOpen: false }) }}
        />
        <div className={css(styles.RFPPage_company)}>
          <a href="/">
            <img className={css(styles.RFPPage_haloLogo)} src={haloLogo} alt="halo logo" />
          </a>

          <img className={css(styles.RFPPage_backgroundImage)} src={backgroundImage} alt="background-image" />
          <div className={css(styles.RFPPage_backgroundImageRectangle)} />
          <img className={css(styles.RFPPage_backgroundBean)} src={beanImage} />
          <div className={css(styles.RFPPage_mobileBean)} />

          <div className={css(styles.RFPPage_titleSpacer)} />

          <div className={css(styles.RFPPage_innovationContainer)}>
            <a className={css(styles.RFPPage_companyLink)} href={`/company/${currentRFP.company.identifier}`}>
              {currentRFP.company.company_name}
            </a>
            {currentRFP.company.is_partner &&
              <div className={css(styles.RFPPage_verifiedIconContainer)}>
                <img className={css(styles.RFPPage_verifiedIcon)} src={verifiedPartnerIcon} />
                <span className={css(styles.RFPPage_verifiedIconText)}>Actively seeking proposals</span>
              </div>}
            <div className={css(styles.RFPPage_title)}>{currentRFP.title}</div>
            <div className={css(styles.RFPPage_subtitle)}>
              {currentRFP.subtitle}
            </div>
      {/*      {currentRFP.therapeutic_area &&
                <div className={css(styles.RFPPage_therapeuticArea)}>
                  {currentRFP.therapeutic_area}
                </div>
                }
            {currentRFP.innovation_types && currentRFP.innovation_types.slice(0, 4).map((innovationType, i) => (
              innovationType.value &&
                <div key={`innovation-type-${innovationType}-${i}`} className={css(styles.RFPPage_innovationType)}>
                  {innovationType.value}
                </div>
            ))}
*/}          </div>
        </div>
        <div className={css(styles.RFPPage_container)}>
          <Grid className={css(styles.RFPPage_bodyGrid)}>
            <Grid.Row columns={2} style={{ display: 'block', marginLeft: '0px', marginRight: '0px' }}>
              {isTabletLandscape && this.renderActionContainer()}
              <Grid.Column width={isTabletLandscape ? 16 : 10}>
                <div className={css(styles.RFPPage_summary)}>{currentRFP.summary}</div>
                {currentRFP.why_it_matters && currentRFP.why_it_matters.length > 0 &&
                  <>
                    <div className={css(styles.RFPPage_section)}>
                      <div className={css(styles.RFPPage_majorSectionHeader)}>Background</div>
                      {transformText(currentRFP.why_it_matters, css(styles.RFPPage_regularFont), css(styles.RFPPage_bulletList), css(styles.SubmitProposal_bulletPoint))}
                    </div>
                    <hr className={css(styles.RFPPage_horizontalRule)} />
                  </>
                }

                <div className={css(styles.RFPPage_majorSectionHeader)}>What we’re looking for</div>
                {}
                {currentRFP.in_scope_proposals && currentRFP.in_scope_proposals.length > 0 &&
                  <div className={css(styles.RFPPage_section)}>
                    {transformText(currentRFP.in_scope_proposals, css(styles.RFPPage_regularFont), css(styles.RFPPage_bulletList), css(styles.SubmitProposal_bulletPoint))}
                  </div>
                }
                {currentRFP.out_of_scope_proposals && currentRFP.out_of_scope_proposals.length > 0 &&
                  <div className={css(styles.RFPPage_section)}>
                    <div className={css(styles.RFPPage_miniSectionHeader)} >
                      What’s out of scope
                    </div>
                    {transformText(currentRFP.out_of_scope_proposals, css(styles.RFPPage_regularFont), css(styles.RFPPage_bulletList), css(styles.SubmitProposal_bulletPoint))}
                  </div>
                }

                {currentRFP.available_resources && currentRFP.available_resources.length > 0 &&
                  <>
                    <hr className={css(styles.RFPPage_horizontalRule)} />
                    <div className={css(styles.RFPPage_section)}>
                      <div className={css(styles.RFPPage_majorSectionHeader)}>What we can offer you</div>
                      <div className={css(styles.RFPPage_regularFont)}>
                        {transformText(currentRFP.additional_resource_details, css(styles.RFPPage_regularFont), css(styles.RFPPage_bulletList), css(styles.SubmitProposal_bulletPoint))}
                      </div>
                      <div className={css(styles.RFPPage_resourceSection)}>
                        {currentRFP.available_resources.map((resource) => {
                          return (
                            <div key={resource.id} className={css(styles.RFPPage_tagContainer)}>
                              <div className={css(styles.RFPPage_tagType)}>
                                <div className={css(styles.RFPPage_tagIcon)}>
                                  <img src={ICONS[resource.resource_type] || ICONS['mentorship_expertise']} alt="tag icon" />
                                </div>
                                <div key={resource.id} className={css(styles.RFPPage_tagText)}>
                                  {gon.available_resource_mapping[resource.resource_type] || resource.resource_type}
                                </div>
                              </div>
                              {resource.description &&
                                <div className={css(styles.RFPPage_tagDescription)}>
                                  {resource.description}
                                </div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                }

                {currentRFP.image &&
                  <div className={css(styles.RFPPage_mainCompanyImageContainer)}>
                    <img src={currentRFP.image} alt="rfp-image" className={css(styles.RFPPage_mainCompanyImage)} />
                  </div>}
              </Grid.Column>
              {!isTabletLandscape && this.renderActionContainer()}
            </Grid.Row>
            {currentRFP.company &&
              <Grid.Row columns={2} style={{ display: 'block', marginLeft: '0px', marginRight: '0px' }}>
                <Grid.Column width={isTabletLandscape ? 16 : 10}>
                  <div className={css(styles.RFPPage_section)}>
                    {currentRFP.company.logo_url && <img className={css(styles.RFPPage_companyLogo)} src={currentRFP.company.logo_url} alt="company-logo" />}
                    <div className={css(styles.RFPPage_companySectionHeader)}>Who we are</div>
                    {currentRFP.company.description && currentRFP.company.description.length > 0 &&
                      <div className={css(styles.RFPPage_regularFont, styles.RFPPage_companyDescription)}>
                        {currentRFP.company.description} <a href={`/company/${currentRFP.company.identifier}`} target="_blank">Learn more</a>
                      </div>}

                    <div className={css(styles.RFPPage_reviewerCardContainer)}>
                      {currentRFP.company.company_reviewers && currentRFP.company.company_reviewers.slice(0, 2).map((reviewer, i) => {
                        return (
                          <div key={`reviewer-${i}`} className={css(styles.RFPPage_reviewerCard)}>
                            <div className={css(styles.RFPPage_reviewerDescription)}>
                              {reviewer.introduction}
                            </div>
                            <div className={css(styles.RFPPage_reviewerInfo)}>
                              {reviewer.image_url && <img className={css(styles.RFPPage_reviewerPicture)} src={reviewer.image_url} alt="reviewer-picture" />}
                              <div className={css(styles.RFPPage_nameInfo)}>
                                <div className={css(styles.RFPPage_reviewerName)}>{reviewer.reviewer_name}</div>
                                <div className={css(styles.RFPPage_reviewerPosition)}>{reviewer.position}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>}
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentRFP: state.defaultReducer.currentRFP,
    savedRFPs: state.defaultReducer.savedRFPs,
    isUpdatingSaveRFP: state.defaultReducer.isUpdatingSaveRFP,
    loginModalOpen: state.profiles.loginModalOpen,
    windowDimensions: state.window,
  };
};

const mapDispatchToProps = {
  saveRFP: saveRFPAction,
  unsaveRFP: unsaveRFPAction,
  updateCurrentRFP: updateCurrentRFPAction,
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(RFPPage);
