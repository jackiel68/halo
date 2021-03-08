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
  loadCompany as loadCompanyAction,
  saveRFP as saveRFPAction,
  unsaveRFP as unsaveRFPAction,
  initializeSaveRFPs as initializeSaveRFPsAction,
  followCompany as followCompanyAction,
  unfollowCompany as unfollowCompanyAction,
  initializeFollowedCompanies as initializeFollowedCompaniesAction,
} from '../../actions/defaultActions';
import {
  toggleLoginModal as toggleLoginModalAction,
} from '../../actions/profileActions';

const { TABLET_LANDSCAPE_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  CompanyPage_container: {
    width: '85%',
    margin: 'auto',
    zIndex: 100,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '90%',
    },
  },
  CompanyPage_company: {
    background: COLORS.haloGray,
    height: '511px',
    position: 'relative',
    overflow: 'hidden',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      background: COLORS.white,
      textAlign: 'left',
      height: 'auto',
    },
  },
  CompanyPage_companyLink: {
    color: COLORS.haloBlack,
    fontSize: '36px',
    lineHeight: '48px',
    fontWeight: 'bold',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      fontSize: '24px',
      lineHeight: '36px',
    },
  },
  CompanyPage_title: {
    color: COLORS.haloBlack,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 'bold',
    fontSize: '18px',
    lineHeight: '30px',
    textAlign: 'center',
    marginBottom: '8px',
    width: '100%',
  },
  CompanyPage_titleLink: {
    textDecoration: 'none',
    width: '100%',
    color: COLORS.haloBlack,
  },
  CompanyPage_summary: {
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '28px',
    marginBottom: '8px',
  },
  CompanyPage_bulletList: {
    marginLeft: '15px',
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
  },
  CompanyPage_regularFont: {
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
  },
  CompanyPage_miniSectionHeader: {
    marginLeft: '15px',
    fontWeight: 'bold',
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
    marginBottom: '20px',
  },
  CompanyPage_actionSubline: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: '14px',
    lineHeight: '24px',
    textAlign: 'center',
    color: COLORS.lightGray,
    marginBottom: '24px',
  },
  CompanyPage_submitButton: {
    width: '90%',
    maxWidth: '90%',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    border: `2px solid ${COLORS.lightBlue}`,
    borderRadius: '4px',
    padding: '8px 30px',
    color: COLORS.white,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '16px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '90%',
    },
  },
  CompanyPage_shareButton: {
    backgroundColor: COLORS.snowWhite,
    border: `2px solid ${COLORS.gray}`,
    borderRadius: '4px',
    padding: '8px 20px',
    color: COLORS.gray,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '13px',
    marginRight: '8px',
    marginLeft: '8px',
  },
  CompanyPage_saveButton: {
    color: COLORS.haloBlue,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '16px',
    marginTop: '25px',
    textAlign: 'center',
  },
  CompanyPage_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  CompanyPage_section: {
    marginBottom: '30px',
  },
  CompanyPage_verifiedIconContainer: {
    display: 'block',
  },
  CompanyPage_verifiedIcon: {
    display: 'inline-block',
    marginLeft: '5px',
    marginRight: '5px',
  },
  CompanyPage_verifiedIconText: {
    display: 'inline-block',
    color: COLORS.haloBlue,
    fontSize: '12px',
    lineHeight: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  CompanyPage_tag: {
    marginRight: '10px',
    width: '200px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '48%',
      marginRight: '2%',
    },
  },
  CompanyPage_tagText : {
    marginRight: '10px',
    display: 'inline-block',
    color: COLORS.haloBlack,
    fontSize: '16px',
    lineHeight: '30px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      fontSize: '14px',
      lineHeight: '24px',
    },
  },
  CompanyPage_therapeuticArea: {
    fontWeight: 600,
    display: 'inline-block',
    width: '100%',
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: '8px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  CompanyPage_innovationType: {
    fontWeight: 600,
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    marginRight: '16px',
    color: COLORS.lightGray,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  CompanyPage_innovationContainer: {
    width: '85%',
    margin: 'auto',
    top: '272px',
    position: 'relative',
    marginBottom: '12px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      left: 'auto',
      width: '90%',
      margin: '100px auto 12px',
      top: '0',
    },
  },
  CompanyPage_backgroundImage: {
    position: 'absolute',
    width: '80%',
    height: '577px',
    left: '30%',
    top: '80px',
    mixedBlendMode: 'lighten',
    zIndex: 1000,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      left: '5%',
      position: 'relative',
      width: '100%',
      maxHeight: '280px',
    },
  },
  CompanyPage_backgroundImageRectangle: {
    position: 'absolute',
    left: '0px',
    top: '4px',
    width: '100%',
    height: '601px',

    background: 'linear-gradient(90.87deg, rgba(246, 248, 251, 0.15) 28.23%, rgba(246, 248, 251, 0.8) 99.65%)',
    mixBlendMode: 'normal',
  },
  CompanyPage_backgroundBean: {
    position: 'absolute',
    left: '20%',
    width: '80%',
    top: '-100px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      top: '100px',
    },
  },
  CompanyPage_majorSectionHeader: {
    marginBottom: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '24px',
    color: COLORS.haloBlack,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      fontSize: '18px',
      lineHeight: '30px',
    },
  },
  CompanyPage_submitProposalHeader: {
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '24px',
    color: COLORS.haloBlack,
  },
  CompanyPage_companySectionHeader: {
    marginTop: '-10px',
    marginBottom: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '24px',
    color: COLORS.haloBlack,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      fontSize: '18px',
      lineHeight: '30px',
    },
  },
  CompanyPage_haloLogo: {
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
  CompanyPage_horizontalRule: {
    marginTop: '30px',
    marginBottom: '30px',
    borderTop: '2px solid #E7EAEE',
  },
  CompanyPage_tagSection: {
    marginTop: '60px',
    marginBottom: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
      marginTop: '30px',
    },
  },
  CompanyPage_tagIcon: {
    height: '48px',
    width: '48px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',
    backgroundColor: COLORS.trueGray,
  },
  CompanyPage_actionContainer: {
    position: 'relative',
    textAlign: 'center',
    marginTop: '60px',
    float: 'right',
    border: `2px solid ${COLORS.haloBlue}`,
    padding: '30px',
    borderRadius: '4px',
    maxWidth: '100%',
    width: '375px',
    backgroundColor: COLORS.white,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      padding: '24px auto',
      marginTop: '48px',
      float: 'unset',
      width: '95%',
    },
  },
  CompanyPage_signedOutContainer: {
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
  CompanyPage_becomePartnerLink: {
    color: COLORS.haloBlack,
    cursor: 'pointer',
  },
  CompanyPage_signinButton: {
    width: '150px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    border: `2px solid ${COLORS.lightBlue}`,
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
  CompanyPage_heartIcon: {
    marginRight: '5px',
    cursor: 'pointer',
  },
  CompanyPage_companyLogo: {
    position: 'absolute',
    top: '-10px',
    right: '0',
  },
  CompanyPage_quoteCardContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      display: 'block',
    },
  },
  CompanyPage_quoteCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    width: '30%',
    border: `2px solid ${COLORS.borderGray}`,
    minHeight: '444px',
    borderRadius: '6px',
    marginRight: '2%',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '95%',
      margin: '0px auto 30px',
      minHeight: '270px',
    },
  },
  CompanyPage_companyDescription: {
    marginBottom: '48px',
    fontSize: '20px',
    lineHeight: '30px',
    color: COLORS.haloBlack,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      marginBottom: '24px',
    },
  },
  CompanyPage_quoteDescription: {
    margin: '30px 24px',
    color: COLORS.haloBlack,
    fontSize: '16px',
  },
  CompanyPage_quotePicture: {
    height: '180px',
    width: '135px',
    minWidth: '135px',
    marginRight: '16px',
    borderRadius: '0 0 0 6px',
    position: 'relative',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      height: '104px',
      width: '96px',
    },
  },
  CompanyPage_quoteInfo: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    bottom: '0',
    alignSelf: 'flex-end',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  CompanyPage_quoteName: {
    fontSize: '18px',
    color: COLORS.black,
    fontWeight: 500,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '24px',
    },
  },
  CompanyPage_quotePosition: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: '12px',
  },
  CompanyPage_nameInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  CompanyPage_actionContainerWebsite: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignitems: 'center',
  },
  CompanyPage_visitWebsiteLink: {
    marginLeft: '10px',
    color: COLORS.haloBlue,
    cursor: 'pointer',
  },
  CompanyPage_focusTypeContainer: {
    display: 'flex',
    marginBottom: '60px',
    flexWrap: 'wrap',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      marginBottom: '48px',
    },
  },
  CompanyPage_focusType: {
    marginRight: '2%',
    marginBottom: '16px',
    fontWeight: 'bold',
    color: COLORS.haloBlack,
    border: `2px solid ${COLORS.borderGray}`,
    borderRadius: '4px',
    fontSize: '18px',
    lineHeight: '30px',
    height: '30px',
    width: '48%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '28px',
    height: '78px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  CompanyPage_imageContainer: {
    marginBottom: '60px',
    flexWrap: 'wrap',
    position: 'relative',
    display: 'flex',
    left: '-20%',
    width: '120%',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      left: '-5%',
      width: '126%',
      marginBottom: '42px',
    },
  },
  CompanyPage_companyImage: {
    position: 'relative',
    width: '48%',
    marginRight: '2%',
    height: '275px',
    backgroundPosition: 'center 50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '4px',
  },
  CompanyPage_partnerContainer: {
    marginBottom: '60px',
    flexWrap: 'wrap',
    position: 'relative',
    display: 'flex',
  },
  CompanyPage_companyPartner: {
    padding: '24px 28px',
    minHeight: '250px',
    width: '48%',
    marginRight: '2%',
    border: `2px solid ${COLORS.borderGray}`,
    borderRadius: '4px',
    marginBottom: '10px',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
      border: 'none',
      borderBottom: `2px solid ${COLORS.borderGray}`,
      paddingBottom: '24px',
      minHeight: 'none',
    },
  },
  CompanyPage_partnerResearchType: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '20px',
    textTransform: 'uppercase',
    color: COLORS.lightGray,
    marginBottom: '4px',
  },
  CompanyPage_partnerInstitutionName: {
    fontWeight: 'bold',
    fontSize: '18px',
    lineHeight: '30px',
    color: COLORS.haloBlack,
    marginBottom: '4px',
  },
  CompanyPage_partnerPartnerName: {
    fontSize: '16px',
    lineHeight: '28px',
    color: COLORS.haloBlack,
    marginBottom: '4px',
  },
  CompanyPage_partnerDescription: {
    fontSize: '16px',
    lineHeight: '28px',
    color: COLORS.haloBlack,
    marginBottom: '4px',
  },
  CompanyPage_mainCompanyImageContainer: {
    marginBottom: '60px',
    position: 'relative',
    left: '-20%',
    width: '120%',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      left: '-5%',
      width: '126%',
      marginBottom: '48px',
    },
  },
  CompanyPage_mainCompanyImage: {
    position: 'relative',
    width: '100%',
  },
  CompanyPage_opportunitiesContainer: {
    border: `2px solid ${COLORS.borderGray}`,
    borderRadius: '4px',
    padding: '30px',
    marginTop: '24px',
    float: 'right',
    width: '375px',
    maxWidth: '100%',
    backgroundColor: COLORS.white,
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      float: 'unset',
      width: '95%',
    },
  },
  CompanyPage_opportunitiesHeader: {
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '36px',
    margin: 'auto',
    color: COLORS.haloBlack,
    marginBottom: '18px',
    textAlign: 'center',
  },
  CompanyPage_noResults: {
    textAlign: 'center',
    fontSize: '18px',
    color: COLORS.haloBlack,
  },
});

class CompanyPage extends PureComponent {
  componentDidMount() {
    const {
      loadCompany,
      match,
      initializeSaveRFPs,
      initializeFollowedCompanies,
    } = this.props;

    loadCompany(match.params.identifier);
    initializeSaveRFPs(gon.saved_rfps || {});
    initializeFollowedCompanies(gon.followed_companies || {});
  }

  renderOpportunities = () => {
    const {
      currentCompany,
    } = this.props;

    const companyOpportunities = gon.all_rfps.filter((rfp) => rfp.company_id === currentCompany.id)
    return (
      <div className={css(styles.CompanyPage_opportunitiesContainer)}>
        <div className={css(styles.CompanyPage_opportunitiesHeader)}>
          Opportunities
        </div>
        {companyOpportunities && companyOpportunities.length > 0 ? (
          <div>
            {companyOpportunities.map((rfp, i) => {
              const { savedRFPs } = this.props;
              return (
                <div key={`rfp-${rfp.id}`}>
                  <div className={css(styles.CompanyPage_therapeuticArea)}>
                    {rfp.therapeutic_area}
                  </div>
                  <div className={css(styles.CompanyPage_title)}>
                    <a
                      href={`/research/${rfp.research_area}/${rfp.identifier}`}
                      className={css(styles.CompanyPage_titleLink)}
                      target="_blank"
                    >
                      {rfp.title}
                    </a>
                  </div>
                  <div className={css(styles.CompanyPage_summary)}>
                    {rfp.summary}
                  </div>
                  {gon.logged_in &&
                    <div
                      className={css(styles.CompanyPage_saveButton)}
                      onClick={() => { this.handleSave(rfp.id) }}
                    >
                      <img className={css(styles.CompanyPage_heartIcon)} src={savedRFPs[rfp.id] ? filledHeartIcon : heartIcon} alt='heart' /> {savedRFPs[rfp.id] ? "Unsave" : "Save"}
                    </div>}
                  {i !== companyOpportunities.length - 1 && <hr className={css(styles.CompanyPage_horizontalRule)} />}
                </div>
              );
            })}
          </div>
        ) : <div className={css(styles.CompanyPage_noResults)}>No Request for Proposals yet</div>}
      </div>
    );
  }

  renderActionContainer = () => {
    const {
      windowDimensions: {
        isTabletLandscape,
      },
      toggleLoginModal,
      currentCompany,
      followedCompanies,
    } = this.props;
    const isSaved = false;

    let companyUrl = (currentCompany.url || '');

    if (companyUrl.startsWith("http")) {
      companyUrl = companyUrl.split('://')[1]
    }
    return (
      <Grid.Column width={isTabletLandscape ? 16 : 5}>
        {isTabletLandscape && this.renderOpportunities()}
        <div className={css(styles.CompanyPage_actionContainer)}>
          <div className={css(styles.CompanyPage_submitProposalHeader)}>
            Follow {currentCompany.company_name}
          </div>
          <div className={css(styles.CompanyPage_actionSubline)}>
            Be the first to learn about new opportunities
          </div>
          <Button
            className={css(styles.CompanyPage_submitButton)}
            onClick={() => {
              !gon.logged_in ? toggleLoginModal(true) : this.handleFollow(currentCompany.id);
            }}
          >
            {followedCompanies[currentCompany.id] ? 'Unfollow' : 'Follow'}
          </Button>
          <div className={css(styles.CompanyPage_actionContainerWebsite)}>
            <img src={ICONS.globe} alt='globe-icon' />
            <a href={`//${companyUrl}`} target="_blank" className={css(styles.CompanyPage_visitWebsiteLink)}>Visit website </a>
          </div>
        </div>
      {!isTabletLandscape && this.renderOpportunities()}
      </Grid.Column>
    );
  }

  handleSave = async (rfpId) => {
    const {
      savedRFPs,
      saveRFP,
      unsaveRFP,
      currentRFP,
      isUpdatingSaveRFP,
    } = this.props;

    if (isUpdatingSaveRFP[rfpId]) {
      return;
    }

    if (savedRFPs[rfpId]) {
      await unsaveRFP(rfpId);
    } else {
      await saveRFP(rfpId);
    }
  };

  handleFollow = async () => {
    const {
      currentCompany,
      followedCompanies,
      followCompany,
      unfollowCompany,
      isUpdatingFollowedCompanies,
    } = this.props;

    if (isUpdatingFollowedCompanies[currentCompany.id]) {
      return;
    }

    if (followedCompanies[currentCompany.id]) {
      await unfollowCompany(currentCompany.id);
    } else {
      await followCompany(currentCompany.id);
    }
  };

  render() {
    const {
      currentCompany,
      toggleLoginModal,
      windowDimensions: {
        isTabletLandscape,
      },
    } = this.props;

    return (
      <div>
        <div className={css(styles.CompanyPage_company)}>
          <a href="/">
            <img className={css(styles.CompanyPage_haloLogo)} src={haloLogo} alt="halo logo" />
          </a>

          <img
            className={css(styles.CompanyPage_backgroundImage)}
            style={{
              backgroundImage: `url(${currentCompany.hero_image_url})`,
            }}
          />

          <div className={css(styles.CompanyPage_innovationContainer)}>
            <a className={css(styles.CompanyPage_companyLink)} href={`/company/${currentCompany.identifier}`}>
              {currentCompany.company_name}
            </a>
            {currentCompany.is_partner &&
              <div className={css(styles.CompanyPage_verifiedIconContainer)}>
                <img className={css(styles.CompanyPage_verifiedIcon)} src={verifiedPartnerIcon} />
                <span className={css(styles.CompanyPage_verifiedIconText)}>Actively seeking proposals</span>
              </div>}
          </div>
        </div>
        <div className={css(styles.CompanyPage_container)}>
          <Grid style={{ marginLeft: '0' }}>
            <Grid.Row columns={2}>
              <Grid.Column width={isTabletLandscape ? 16 : 11}>
                <div className={css(styles.CompanyPage_tagSection)}>
                  {currentCompany.location &&
                    <div className={css(styles.CompanyPage_tag)}>
                      <div className={css(styles.CompanyPage_tagIcon)}>
                        <img src={ICONS.locationpin} alt="tag icon" />
                      </div>
                      <div className={css(styles.CompanyPage_tagText)}>
                        {currentCompany.location}
                      </div>
                    </div>}
                  {currentCompany.employee_count &&
                    <div className={css(styles.CompanyPage_tag)}>
                      <div className={css(styles.CompanyPage_tagIcon)}>
                        <img src={ICONS.employee} alt="tag icon" />
                      </div>
                      <div className={css(styles.CompanyPage_tagText)}>
                        {currentCompany.employee_count} employees
                      </div>
                    </div>}
                  {currentCompany.sales_amount &&
                    <div className={css(styles.CompanyPage_tag)}>
                      <div className={css(styles.CompanyPage_tagIcon)}>
                        <img src={ICONS.funding} alt="tag icon" />
                      </div>
                      <div className={css(styles.CompanyPage_tagText)}>
                        {currentCompany.sales_amount} in sales
                      </div>
                    </div>}
                </div>

                {currentCompany.description && currentCompany.description.length > 0 &&
                  <div className={css(styles.CompanyPage_regularFont, styles.CompanyPage_companyDescription)}>
                    {currentCompany.description}
                  </div>}

                <div className={css(styles.CompanyPage_majorSectionHeader)}>Our research interests</div>
                <div className={css(styles.CompanyPage_focusTypeContainer)}>
                  {currentCompany.company_focuses &&
                    currentCompany.company_focuses.map((focus) => {
                      return (
                        <div key={`focus-${focus.id}`} className={css(styles.CompanyPage_focusType)}>
                          {focus.focus_type}
                        </div>
                      );
                    })
                  }
                </div>

                {currentCompany.company_images && currentCompany.company_images.length > 0 &&
                  <div className={css(styles.CompanyPage_imageContainer)}>
                    {currentCompany.company_images.map((image) => {
                      return (
                        <div key={`image-${image.id}`}
                          style={{ backgroundImage: `url(${image.image_url})` }}
                          className={css(styles.CompanyPage_companyImage)}
                        />
                      );
                    })}
                  </div>}

                {currentCompany.company_partners && currentCompany.company_partners.length > 0 &&
                  <>
                    <div className={css(styles.CompanyPage_majorSectionHeader)}>Who we partner with</div>
                    <div className={css(styles.CompanyPage_partnerContainer)}>
                      {currentCompany.company_partners.map((partner, i) => {
                        return (
                          <div
                            key={`partner-${partner.id}`}
                            style={{ borderBottom: i === currentCompany.company_partners.length - 1 ? 'none' : `2px solid ${COLORS.borderGray}` }}
                            className={css(styles.CompanyPage_companyPartner)}
                          >
                            <div className={css(styles.CompanyPage_partnerResearchType)}>
                              {partner.research_area}
                            </div>
                            <div className={css(styles.CompanyPage_partnerInstitutionName)}>
                              {partner.institution_name}
                            </div>
                            {partner.partner_name &&
                              <div className={css(styles.CompanyPage_partnerPartnerName)}>
                                Research: {partner.partner_name}
                              </div>}
                            <div className={css(styles.CompanyPage_partnerDescription)}>
                              {partner.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>}

                {currentCompany.company_image_url &&
                  <div className={css(styles.CompanyPage_mainCompanyImageContainer)}>
                    <img src={currentCompany.company_image_url} alt="company-image" className={css(styles.CompanyPage_mainCompanyImage)} />
                  </div>}
              </Grid.Column>
              {!isTabletLandscape && this.renderActionContainer()}
            </Grid.Row>
            {currentCompany && currentCompany.company_quotes && currentCompany.company_quotes.length > 0 &&
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className={css(styles.CompanyPage_section)}>
                    <div className={css(styles.CompanyPage_companySectionHeader)}>How we make an impact</div>

                    <div className={css(styles.CompanyPage_quoteCardContainer)}>
                      {currentCompany.company_quotes && currentCompany.company_quotes.slice(0, 3).map((quote, i) => {
                        return (
                          <div key={`quote-${i}`} className={css(styles.CompanyPage_quoteCard)}>
                            <div className={css(styles.CompanyPage_quoteDescription)}>
                              "{quote.quote}"
                            </div>
                            <div className={css(styles.CompanyPage_quoteInfo)}>
                              {quote.image_url && <img className={css(styles.CompanyPage_quotePicture)} src={quote.image_url} alt="quoet-picture" />}
                              <div className={css(styles.CompanyPage_nameInfo)}>
                                <div className={css(styles.CompanyPage_quoteName)}>{quote.employee_name}</div>
                                <div className={css(styles.CompanyPage_quotePosition)}>{quote.role}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>}
            {isTabletLandscape && this.renderActionContainer()}
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentCompany: state.defaultReducer.currentCompany,
    windowDimensions: state.window,
    isUpdatingSaveRFP: state.defaultReducer.isUpdatingSaveRFP,
    savedRFPs: state.defaultReducer.savedRFPs,
    isUpdatingFollowedCompanies: state.defaultReducer.isUpdatingFollowedCompanies,
    followedCompanies: state.defaultReducer.followedCompanies,
  };
};

const mapDispatchToProps = {
  saveRFP: saveRFPAction,
  unsaveRFP: unsaveRFPAction,
  initializeSaveRFPs: initializeSaveRFPsAction,
  followCompany: followCompanyAction,
  unfollowCompany: unfollowCompanyAction,
  initializeFollowedCompanies: initializeFollowedCompaniesAction,
  loadCompany: loadCompanyAction,
  toggleLoginModal: toggleLoginModalAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompanyPage);
