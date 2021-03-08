import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { css, StyleSheet } from 'aphrodite';
import { Container, Button, Grid } from 'semantic-ui-react';

import { COLORS, ICONS, WINDOW_DIMENSIONS } from '../../../../constants';
import { authenticityToken } from '../../utils/requests';
import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import filledHeartIcon from '../../../../images/icons/filled_heart.svg';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import backgroundImage from '../../../../images/backgrounds/droplet-background.svg';
import beanImage from '../../../../images/backgrounds/bean.svg';
import {
  fetchRequestForProposalsByResearchArea as fetchRequestForProposalsByResearchAreaAction,
} from '../../actions/companyActions';
import {
  toggleLoginModal as toggleLoginModalAction,
} from '../../actions/profileActions';
import { transformText } from '../../utils/textUtils';

import WelcomeUniversityModal from '../RFPPage/WelcomeUniversityModal';

const { TABLET_LANDSCAPE_MEDIA_QUERY, MOBILE_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  ResearchPage_container: {
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
  ResearchPage_company: {
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
      height: '430px',
      background: COLORS.white
    },

  },
  ResearchPage_companyLink: {
    color: COLORS.black,
    fontSize: '20px',
    lineHeight: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    [MOBILE_MEDIA_QUERY]: {
      display: 'block',
    },
  },
  ResearchPage_title: {
    color: COLORS.black,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 'bold',
    fontSize: '36px',
    lineHeight: '30px',
    marginBottom: '20px',
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
      margin: '10px 0'
    },
  },
  ResearchPage_summary: {
    color: COLORS.black,
    fontSize: '20px',
    lineHeight: '30px',
    marginTop: '50px',
    marginBottom: '0px',
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '16px',
    },
  },
  ResearchPage_bulletList: {
    marginLeft: '15px',
    color: COLORS.black,
    fontSize: '16px',
    lineHeight: '30px',
  },
  ResearchPage_regularFont: {
    color: COLORS.black,
    fontSize: '16px',
    lineHeight: '30px',
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '14px',
    },
  },
  ResearchPage_miniSectionHeader: {
    fontWeight: 'bold',
    color: COLORS.black,
    fontSize: '16px',
    lineHeight: '30px',
    marginBottom: '20px',
  },
  ResearchPage_emptyContainer: {
    color: COLORS.black,
    fontSize: '20px',
    textAlign: 'center',
    margin: '70px auto',
  },
  ResearchPage_deadline: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '24px',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: COLORS.lightGray,
    marginBottom: '16px',
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '12px'
    },
  },
  ResearchPage_submitButton: {
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
    marginTop: '20px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      maxWidth: '100%'
    },
  },
  ResearchPage_shareButton: {
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
  ResearchPage_saveButton: {
    color: COLORS.haloBlue,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '16px',
    marginTop: '25px',
    textAlign: 'center',
  },
  ResearchPage_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  ResearchPage_section: {
    marginBottom: '30px',
  },
  ResearchPage_verifiedIconContainer: {
    display: 'inline-block',
  },
  ResearchPage_verifiedIcon: {
    display: 'inline-block',
    marginLeft: '5px',
    marginRight: '5px',
    [MOBILE_MEDIA_QUERY]: {
      marginLeft: '0',
      height: '25px',
      position: 'relative',
      top: '-1px',
      left: '5px'
    },
  },
  ResearchPage_verifiedIconText: {
    display: 'inline-block',
    color: COLORS.haloBlue,
    fontSize: '12px',
    lineHeight: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  ResearchPage_tagContainer: {
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
  ResearchPage_tagText : {
    marginRight: '10px',
    display: 'inline-block',
    color: COLORS.black,
    fontSize: '16px',
    lineHeight: '30px',
  },
  ResearchPage_tagDescription: {
    alignSelf: 'flex-end',
    margin: '0 24px',
    fontSize: '14px',
    lineHeight: '28px',
    color: COLORS.black,
    marginBottom: '20px',
  },
  ResearchPage_tagType: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    margin: '24px 24px 14px',
  },
  ResearchPage_subtitle: {
    fontWeight: 600,
    fontSize: '26px',
    lineHeight: '30px',
    marginBottom: '15px',
    color: COLORS.black,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  ResearchPage_tagline: {
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '30px',
    color: COLORS.black,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  ResearchPage_therapeuticArea: {
    fontWeight: 600,
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginRight: '16px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  ResearchPage_innovationType: {
    fontWeight: 600,
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginRight: '16px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  ResearchPage_innovationContainer: {
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
      marginTop: '65px'
    },
  },
  ResearchPage_backgroundImage: {
    position: 'absolute',
    width: '80%',
    height: '577px',
    left: '30%',
    top: '24px',
    mixedBlendMode: 'lighten',
    [MOBILE_MEDIA_QUERY]: {
      width: '116%',
      left: '12%',
      top: '-22%'
    },
  },
  ResearchPage_actionContainerSubheader: {
    color: COLORS.black,
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
  },
  ResearchPage_backgroundImageRectangle: {
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
  ResearchPage_backgroundBean: {
    position: 'absolute',
    left: '20%',
    width: '80%',
    top: '-100px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      top: '100px',
    },
  },
  ResearchPage_majorSectionHeader: {
    marginTop: '50px',
    marginBottom: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '24px',
    color: COLORS.black,
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '18px',
    },
  },
  ResearchPage_actionContainerHeader: {
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '24px',
    color: COLORS.black,
  },
  ResearchPage_companySectionHeader: {
    marginTop: '-10px',
    marginBottom: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '24px',
    color: COLORS.black,
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '18px',
    },
  },
  ResearchPage_haloLogo: {
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
  },
  ResearchPage_horizontalRule: {
    marginTop: '45px',
    marginBottom: '45px',
    borderTop: '2px solid #E7EAEE',
  },
  ResearchPage_resourceSection: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
  },
  ResearchPage_tagIcon: {
    height: '48px',
    width: '48px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '16px',
    backgroundColor: COLORS.trueGray,
  },
  ResearchPage_actionContainer: {
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
      padding: '16px',
    },
  },
  ResearchPage_signedOutContainer: {
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
  ResearchPage_researchItemContainer: {
    height: '290px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    border: '1px solid #EFEFEF',
    padding: '31px 38px',
    marginBottom: '36px',
    position: 'relative',
    [MOBILE_MEDIA_QUERY]: {
      padding: '24px 16px 50px 16px',
      height: 'auto'
    },
  },
  ResearchPage_becomePartnerLink: {
    color: COLORS.black,
    cursor: 'pointer',
  },
  ResearchPage_signinButton: {
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
  ResearchPage_heartIcon: {
    marginRight: '5px',
    cursor: 'pointer',
  },
  ResearchPage_companyLogo: {
    position: 'absolute',
    top: '-10px',
    right: '0',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      position: 'relative',
      marginBottom: '30px',
    },
  },
  ResearchPage_reviewerCardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      display: 'block',
    },
  },
  ResearchPage_reviewerCard: {
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
  ResearchPage_companyDescription: {
    marginBottom: '30px',
  },
  ResearchPage_reviewerDescription: {
    margin: '30px 24px',
    color: COLORS.black,
    fontSize: '16px',
  },
  ResearchPage_reviewerPicture: {
    height: '180px',
    width: '135px',
    minWidth: '135px',
    marginRight: '16px',
    borderRadius: '0 0 0 6px',
  },
  ResearchPage_reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    bottom: '0',
    alignSelf: 'flex-start',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  ResearchPage_reviewerName: {
    fontSize: '18px',
    color: COLORS.black,
    fontWeight: 500,
  },
  ResearchPage_reviewerPosition: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: '12px',
  },
  ResearchPage_nameInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  ResearchPage_bodyGrid: {
    display: 'block',
    marginLeft: '0',
    marginRight: '0',
  },
  ResearchPage_deadline: {
    fontSize: '16px',
    bottom: '30px',
    right: '30px',
    position: 'absolute',
    color: '#9E9E9E',
    [MOBILE_MEDIA_QUERY]: {
      bottom: '16px',
      right: '16px',
    },
  },
  ResearchPage_mainCompanyImageContainer: {
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
  ResearchPage_mainCompanyImage: {
    position: 'relative',
    width: '100%',
  },
  ResearchPage_rfpTitle: {
    fontSize: '18px',
    lineHeight: '30px',
    fontWeight: 'bold',
    marginTop: '15px',
    marginBotom: '15px',
    color: COLORS.black,
    cursor: 'pointer',
  },
  ResearchPage_rfpSubtitle: {
    fontSize: '18px',
    lineHeight: '30px',
    marginTop: '15px',
    marginBotom: '15px',
    color: COLORS.black,
    [MOBILE_MEDIA_QUERY]: {
      fontSize: '16px'
    },
  },
  ResearchPage_inputField: {
    width: '90%',
    margin: '20px auto 0px',
    border: `1px solid ${COLORS.lightGray}`,
    padding: '5px 12px',
    borderRadius: '4px',
    height: '48px',
    fontSize: '14px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  }
});

class ResearchPage extends PureComponent {
  constructor(props) {
    super(props);
    console.log("hello");
    this.state = {
      welcomeUniversityModalOpen: false,
      universityName: '',
      researchArea: '',
      researchRFPs: [],
      subscribeEmail: '',
      isSubmitted: false,
      isFetching: false,
    };
  }
  componentDidMount = async () => {
    const {
      match,
      updateCurrentRFP,
      toggleLoginModal,
      fetchRequestForProposalsByResearchArea,
    } = this.props;

    const researchArea = match.params.research_area;
    const rfps = await fetchRequestForProposalsByResearchArea(researchArea);

    this.setState({
      researchArea,
      researchRFPs: rfps || [],
    });

    const urlParams = new URLSearchParams(window.location.search);
    const openLogin = urlParams.get('login');
    const university = urlParams.get('university') || urlParams.get('invite');
    if (openLogin && !gon.logged_in) {
      toggleLoginModal(true);
    } else if (university && university.length > 0) {
      this.setState({ welcomeUniversityModalOpen: true, universityName: decodeURI(university) });
    }
  }

  handleChange = async (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  followResearch = async () => {
    const { subscribeEmail, researchArea } = this.state;

    this.setState({ isFetching: true });

    const formData = new FormData();
    formData.append('email', subscribeEmail);
    formData.append('research_area', researchArea);

    try {
      const followResponse = await fetch('/research_follows', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await followResponse.json();

      this.setState({
        isFetching: false,
        isSubmitted: true,
        subscribeEmail: '',
      })
    } catch(err) {
      this.setState({
        isFetching: false,
        isSubmitted: false,
      })
    }
  }

  renderActionContainer = () => {
    const {
      windowDimensions: {
        isTabletLandscape,
        hasScrolledBelowFold,
      },
      toggleLoginModal,
    } = this.props;
    const {
      subscribeEmail,
      isFetching,
      isSubmitted,
    } = this.state;

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
    const humanFriendlyResearchName = this.extractResearchName();

    return (
      <Grid.Column width={isTabletLandscape ? 16 : 6} style={{ position: 'relative' }}>
        <div
          className={css(styles.ResearchPage_actionContainer)}
          style={{
            position: actionPosition,
            right: actionRight,
            top: actionTop,
            maxWidth: actionMaxWidth,
            zIndex: 1000,
          }}
        >
          <div className={css(styles.ResearchPage_actionContainerHeader)}>
            Follow {humanFriendlyResearchName} Research
          </div>
          <div className={css(styles.ResearchPage_actionContainerSubheader)}>
            Be the first to learn about new opportunities
          </div>
          {!isSubmitted &&
            <div>
              <input
                className={css(styles.ResearchPage_inputField)}
                name='subscribeEmail'
                placeholder={'Enter your email here'}
                value={subscribeEmail}
                onChange={(e) => this.handleChange(e, 'subscribeEmail')}
              />
            </div>}
          <Button
            className={css(styles.ResearchPage_submitButton)}
            disabled={isFetching || isSubmitted}
            onClick={() => {
              !gon.logged_in ? toggleLoginModal(true) : this.followResearch()
            }}
          >
            {isSubmitted ? `Followed ${humanFriendlyResearchName}` : `Follow ${humanFriendlyResearchName}`}
          </Button>
        </div>
      </Grid.Column>
    );
  }

  extractResearchName = () => {
    const { researchArea } = this.state;

    return researchArea.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  }

  renderCard = (rfp) => {
    const { researchArea } = this.state;

    return (
      <div key={rfp.id} className={css(styles.ResearchPage_researchItemContainer)}>
        <div style={{ display: 'inline-block', color: '#9E9E9E', fontSize: '16px' }}>{rfp.company.company_name}</div>
        {rfp.company.is_partner &&
          <div className={css(styles.ResearchPage_verifiedIconContainer)}>
            <img className={css(styles.ResearchPage_verifiedIcon)} src={verifiedPartnerIcon} />
          </div>}
        {rfp.company.is_partner &&
          <div style={{ float: 'right', color: COLORS.haloBlue, cursor: 'pointer', fontSize: '14px' }} onClick={() => window.location.href = `/submit_proposal/${rfp.identifier}`}>
            <img style={{ marginRight: '10px', height: '30px' }} src={ICONS.lightningBlue} alt="tag icon" />
            Easy Apply
          </div>}
        <div className={css(styles.ResearchPage_rfpTitle)} onClick={() => window.location.href = `/research/${researchArea}/${rfp.identifier}`}>
          {rfp.title}
        </div>
        <div className={css(styles.ResearchPage_rfpSubtitle)}>
          {rfp.summary}
        </div>
        {rfp.deadline &&
          <div className={css(styles.ResearchPage_deadline)}>
            Deadline: {rfp.deadline ? moment(rfp.deadline).format('MMMM D, YYYY') : ""}
          </div>}
      </div>
    );
  }

  render() {
    const {
      toggleLoginModal,
      windowDimensions: {
        isTabletLandscape,
      },
    } = this.props;
    const {
      welcomeUniversityModalOpen,
      universityName,
      researchArea,
      researchRFPs,
    } = this.state;

    if (!researchArea || researchArea.length === 0) {
      return null;
    }

    const humanFriendlyResearchName = this.extractResearchName();

    return (
      <div>
        <WelcomeUniversityModal
          open={welcomeUniversityModalOpen}
          isLoggedIn={gon.logged_in}
          currentUser={gon.current_user}
          requestForProposal={undefined}
          universityName={universityName}
          closeModal={() => this.setState({ welcomeUniversityModalOpen: false })}
        />
        <div className={css(styles.ResearchPage_company)}>
          <a href="/">
            <img className={css(styles.ResearchPage_haloLogo)} src={haloLogo} alt="halo logo" />
          </a>

          <img className={css(styles.ResearchPage_backgroundImage)} src={backgroundImage} alt="background-image" />
          <div className={css(styles.ResearchPage_backgroundImageRectangle)} />
          <img className={css(styles.ResearchPage_backgroundBean)} src={beanImage} />

          <div className={css(styles.ResearchPage_innovationContainer)}>
            <div className={css(styles.ResearchPage_title)}>{humanFriendlyResearchName} Research</div>
            <div className={css(styles.ResearchPage_subtitle)}>
              Find industry opportunities in {humanFriendlyResearchName.toLowerCase()} research
            </div>
            <div className={css(styles.ResearchPage_tagline)}>
              Submit a proposal to companies seeking research collaboration in {humanFriendlyResearchName.toLowerCase()}
            </div>
          </div>
        </div>
        <div className={css(styles.ResearchPage_container)}>
          <Grid className={css(styles.ResearchPage_bodyGrid)}>
            <Grid.Row columns={2} style={{ display: 'block', marginLeft: '0px', marginRight: '0px' }}>
              {isTabletLandscape && this.renderActionContainer()}
              <Grid.Column width={isTabletLandscape ? 16 : 10}>
                {researchRFPs.length === 0 &&
                  <div className={css(styles.ResearchPage_emptyContainer)}>
                    No Request for Proposals for the {humanFriendlyResearchName} research type
                  </div>
                }
                <div style={{ marginTop: '80px' }}>
                  {researchRFPs.map(rfp => {
                    return this.renderCard(rfp);
                  })}
                </div>
              </Grid.Column>
              {!isTabletLandscape && this.renderActionContainer()}

            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginModalOpen: state.profiles.loginModalOpen,
    windowDimensions: state.window,
  };
};

const mapDispatchToProps = {
  toggleLoginModal: toggleLoginModalAction,
  fetchRequestForProposalsByResearchArea: fetchRequestForProposalsByResearchAreaAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResearchPage);
