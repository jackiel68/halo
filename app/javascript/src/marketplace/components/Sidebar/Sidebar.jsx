import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import { withRouter } from "react-router";
import { Container, Form, Accordion, Icon, Button } from 'semantic-ui-react';
import _ from 'lodash';

import haloLogo from '../../../../images/logos/halo_logo.svg';
import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import { COLORS } from '../../../../constants';
import {
  addFilter as addFilterAction,
  removeFilter as removeFilterAction,
} from '../../actions/defaultActions';
import {
  fetchUser as fetchUserAction,
} from '../../actions/profileActions';
import {
  setReviewerDashboardRFP as setReviewerDashboardRFPAction,
} from '../../actions/companyActions';
import {
  authenticityToken,
  getUrlParameter,
} from '../../utils/requests';

import AffiliationEditModal from './AffiliationEditModal';
import EducationEditModal from './EducationEditModal';
import InterestsEditModal from './InterestsEditModal';
import StartupEditModal from './StartupEditModal';
import ExpertiseEditModal from './ExpertiseEditModal';

const styles = StyleSheet.create({
  Sidebar_container: {
    textAlign: 'center',
  },
  Sidebar_logoBanner: {
    textAlign: 'center',
    paddingTop: '30px',
    paddingBottom: '15px',
    marginBottom: '50px',
  },
  Sidebar_checkboxes: {
    textAlign: 'left',
    marginLeft: 0,
    width: '80%',
    marginTop: 0,
  },
  Sidebar_checkboxLabel: {
    paddingLeft: '30px',
    minHeight: 0,
    fontSize: '13px',
    fontWeight: 500,
  },
  Sidebar_showMoreText: {
    fontSize: '10px',
    color: COLORS.lightGray,
    cursor: 'pointer',
  },
  Sidebar_dropdownIcon: {
    marginLeft: '10px',
    display: 'inline-block',
  },
  Sidebar_showMoreIcon: {
    marginRight: '5px',
    display: 'inline-block',
    height: '20px',
    width: '20px',
  },
  Sidebar_accordion: {
    textAlign: 'left',
    paddingLeft: '80px',
  },
  Sidebar_verifiedIcon: {
    marginLeft: '5px',
    marginRight: '5px',
  },
  Sidebar_companySection: {
    textAlign: 'left',
    marginTop: '70px',
    paddingLeft: '50px',
    paddingRight: '50px',
  },
  Sidebar_companyHeader: {
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '30px',
    color: COLORS.lightBlack,
    marginBottom: '20px',
  },
  Sidebar_popupProfilePic: {
    height: '100px',
    width: '100px',
    backgroundColor: COLORS.transparentDarkGray,
    borderRadius: '100px',
    margin: 'auto',
  },
  Sidebar_regularProfilePic: {
    height: '100px',
    width: '100px',
    backgroundColor: COLORS.transparentGray,
    borderRadius: '100px',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
  },
  Sidebar_profilePicContainer: {
    marginBottom: '20px',
  },
  Sidebar_profileName: {
    color: COLORS.lightBlack,
    fontSize: '24px',
    lineHeight: '48px',
  },
  Sidebar_profileTitle: {
    position: 'relative',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '20px',
    color: COLORS.gray,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '75%',
    margin: '0 auto'
  },
  Sidebar_sidebarHeader: {
    color: COLORS.gray,
    fontSize: '11px',
    fontWeight: 'bold',
    lineHeight: '25px',
    letterSpacing: '1px',
    width: '75%',
    margin: '30px auto 16px',
    textAlign: 'left',
  },
  Sidebar_sidebar: {
    color: COLORS.blue,
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '16px',
    width: '75%',
    margin: 'auto',
    textAlign: 'left',
  },
  Sidebar_interestSidebar: {
    color: COLORS.blue,
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '16px',
    width: '75%',
    margin: 'auto',
    textAlign: 'left',
    display: 'flex',
    flexFlow: 'row wrap',
  },
  Sidebar_keyword: {
    padding: '5px 10px',
    marginRight: '10px',
    marginBottom: '10px',
    width: 'fit-content',
    borderRadius: '4px',
    border: `1px solid ${COLORS.gray}`,
    color: COLORS.gray,
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 500,
  },
  Sidebar_opportunityList: {
    textAlign: 'left',
    marginLeft: '30px',
  },
  Sidebar_opportunityHeader: {
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.lightBlack,
    marginBottom: '16px',
  },
  Sidebar_opportunityTitle: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.lightBlack,
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    width: '75%',
    cursor: 'pointer',
  },
  Sidebar_opportunityTitleActive: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.lightBlack,
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    width: '75%',
    cursor: 'pointer',
  },
  Sidebar_opportunityCount: {
    fontSize: '14px',
    color: COLORS.lightBlack,
    display: 'inline-block',
    width: '25%',
    verticalAlign: 'top',
    textAlign: 'right',
    paddingRight: '15px',
  },
  Sidebar_opportunityRow: {
    marginBottom: '15px',
  },
  Sidebar_uploadIcon: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'inline-flex',
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: '32px',
    width: '100%',
    color: COLORS.gray,
    cursor: 'pointer',
  },
  Sidebar_settingsGroup: {

  },
  Sidebar_settingsLabelActive: {
    color: COLORS.lightBlue,
    fontSize: '14px',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  Sidebar_settingsLabel: {
    color: COLORS.lightBlack,
    fontSize: '14px',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  Sidebar_regularText: {
    color: COLORS.lightBlack,
    fontSize: '14px',
  },
  Sidebar_emptyPFPic: {
    fontSize: '8px',
    lineHeight: '12px',
    position: 'absolute',
    top: '0',
    color: COLORS.white,
    width: '100%',
    height: '100%',
    padding: '50px 10px 0',
    fontWeight: 500,
    ':hover': {
      opacity: '0.8',
    },
  },
  Sidebar_iconButton: {
    color: COLORS.gray,
    marginLeft: '10px',
    fontSize: '14px',
    display: 'inline-block',
    cursor: 'pointer',
    float: 'right',
  },
  Sidebar_iconButtonFloat: {
    color: COLORS.gray,
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: '14px',
    cursor: 'pointer'
  },
  Sidebar_sidebarSubtext: {
    color: COLORS.gray,
    lineHeight: '20px',
  },
  Sidebar_link: {
    color: COLORS.lightBlue,
  },
});

const educationOptions = {
  'Postdoctoral Scientist': 1,
  'MD': 2,
  'PhD': 3,
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndices: [0, 1],
      researchAreaShowMore: false,
      innovationTypesShowMore: false,
      affiliationEdit: false,
      educationEdit: false,
      interestsEdit: false,
      startupEdit: false,
      currentEducation: undefined,
      affiliationEditModalOpen: false,
      startupEditModalOpen: false,
      educationEditModalOpen: false,
      interestEditModalOpen: false,
      expertiseEditModalOpen: false,
      degree: '',
    };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndices } = this.state;

    let newIndices;
    if (activeIndices.includes(index)) {
      newIndices = activeIndices.filter((idx) => idx !== index);
    } else {
      newIndices = activeIndices.concat([index]);
    }
    this.setState({ activeIndices: newIndices });
  };

  showMoreResearchAreas = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        researchAreaShowMore: !prevState.researchAreaShowMore,
      }
    });
  };

  showMoreInnovationTypes = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        innovationTypesShowMore: !prevState.innovationTypesShowMore,
      }
    });
  };

  handleChange = (e, selection) => {
    const {
      addFilter,
      removeFilter,
    } = this.props;

    if (selection.checked) {
      addFilter({ filterType: selection.name, filterValue: selection.value });
    } else {
      removeFilter({ filterType: selection.name, filterValue: selection.value });
    }
  }

  handlePFPicClick = (e) => {
    this.refs.fileUploader.click();
  }

  onPFPicChange = async (e) => {
    const file = e.target.files[0];
    this.setState({ uploading: true });

    const formData = new FormData();

    formData.append('file', file);

    await fetch(`/profile/image-upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': authenticityToken(),
      }
    })
    .then(res => res.json())
    .then(response => {
      this.setState({
        uploading: false,
        image: response.image,
      })
    });
  }

  renderAddStartup = (addedStartup, canEdit) => {
    let companyUrl = (addedStartup.url || '');

    if (companyUrl.startsWith("http")) {
      companyUrl = companyUrl.split('://')[1]
    }

    return (
      <div
        key={`startup-${addedStartup.id}`}
        onMouseEnter={() => this.setState({ addedStartup, startupEdit: true })}
        onMouseLeave={() => this.setState({ startupEdit: false })}
        className={css(styles.Sidebar_sidebar)}
      >
        <div>
          {addedStartup.url.length > 0 ? (
            <a href={`//${addedStartup.url}`} target="_blank" className={css(styles.Sidebar_link)}>
              {addedStartup.startup_name}
            </a>
          ) : (
            <div>{addedStartup.startup_name}</div>
          )}
        </div>
        {canEdit &&
          <div className={css(styles.Sidebar_iconButton)}>
            <Icon onClick={() => this.setState({ startupEditModalOpen: true })} name='edit' />
          </div>}
        <div className={css(styles.Sidebar_sidebarSubtext)}>
          Startup
        </div>
        <div className={css(styles.Sidebar_sidebarSubtext)}>
          {addedStartup.start_year || '?'} - {addedStartup.end_year || 'Present'}
        </div>
        <br />
      </div>
    )
  }

  render() {
    const {
      path,
      currentUser,
      currentRFP,
      currentCompany,
      requestForProposals,
      setReviewerDashboardRFP,
      reviewerDashboardRFP,
    } = this.props;

    const {
      activeIndices,
      researchAreaShowMore,
      innovationTypesShowMore,
      affiliationEdit,
      educationEdit,
      interestsEdit,
      startupEdit,
      interestEditModalOpen,
      affiliationEditModalOpen,
      educationEditModalOpen,
      startupEditModalOpen,
      expertiseEditModalOpen,
      currentEducation,
      degree,
    } = this.state;

    // Would be better to replace this with a <Route> component of some sort tot handle this logic.
    const isStartingPage = path === "/marketplace" || path === "/marketplace/";
    const isCompanyPage = path.startsWith("/company/");
    const isProfilePage = path.startsWith("/profile/");
    const isReviewerDashboard = path.startsWith("/reviewer_dashboard");
    const isAccount = path.startsWith("/account");
    let currentPFPic;
    if (this.state.image) {
      currentPFPic = this.state.image.medium.url;
    } else if (currentUser && currentUser.image && currentUser.image.medium) {
      currentPFPic = currentUser.image.medium.url;
    } else {
      currentPFPic = gon.default_pf_image;
    }

    const areasOfExpertise = researchAreaShowMore ? gon.areas_of_expertise : gon.areas_of_expertise.slice(0, 4);
    const innovationTypes = innovationTypesShowMore ? gon.innovation_types : gon.innovation_types.slice(0, 4);

    const isUser = gon.current_user && currentUser && currentUser.id === gon.current_user.id;
    const isPublic = getUrlParameter('public') === 'true';
    const canEdit = isUser && !isPublic;

    const company = path.startsWith("/company/") ? currentCompany : (currentRFP || {}).company;
    const currentEducations = currentUser && currentUser.educations ? currentUser.educations.map(e => e.degree) : [];
    const addedStartup = currentUser && currentUser.startups && currentUser.startups.length > 0 && currentUser.startups[0];
    const isStartupFounder = currentUser && currentUser.profile_info && currentUser.profile_info.title === 'Startup Founder';
    return (
      <div className={css(styles.Sidebar_container)}>
        <InterestsEditModal
          open={interestEditModalOpen}
          closeModal={() => this.setState({ interestEditModalOpen: false })}
          currentUser={currentUser}
        />
        <AffiliationEditModal
          open={affiliationEditModalOpen}
          closeModal={() => this.setState({ affiliationEditModalOpen: false })}
          currentUser={currentUser}
        />
        <EducationEditModal
          open={educationEditModalOpen}
          education={currentEducation}
          degree={degree}
          closeModal={() => this.setState({ educationEditModalOpen: false })}
        />
        <StartupEditModal
          open={startupEditModalOpen}
          startup={addedStartup || {}}
          closeModal={() => this.setState({ startupEditModalOpen: false })}
        />
        <ExpertiseEditModal
          open={expertiseEditModalOpen}
          currentUser={currentUser}
          closeModal={() => this.setState({ expertiseEditModalOpen: false })}
        />

        <div className={css(styles.Sidebar_logoBanner)}>
          <a href="/">
            <img src={haloLogo} />
          </a>
        </div>
        {isProfilePage && !_.isEmpty(currentUser) && (
          <div>
            <div className={css(styles.Sidebar_profilePicContainer)}>
              {canEdit ? (
                <div
                  className={css(styles.Sidebar_popupProfilePic)}
                  onClick={this.handlePFPicClick}
                  style={{
                    backgroundImage: `url(${currentPFPic})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    position: 'relative',
                  }}
                >
                  <div className={css(styles.Sidebar_emptyPFPic)} style={{ opacity: currentPFPic === gon.current_user.default_image ? '1' : '0' }}>
                    <Icon className={css(styles.Sidebar_uploadIcon)} name="camera" />
                  </div>
                  <input onChange={this.onPFPicChange} type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                </div>
              ) : (
                currentPFPic === gon.default_pf_image && currentUser.first_name && currentUser.last_name ? (
                  <div
                    className={css(styles.Sidebar_regularProfilePic)}
                  >
                    {currentUser.first_name[0].toUpperCase()}{currentUser.last_name[0].toUpperCase()}
                  </div>
                ) : (
                  <div
                    className={css(styles.Sidebar_regularProfilePic)}
                    style={{
                      backgroundImage: `url(${currentUser.image.medium.url})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                    }}
                  />
                )
              )}
            </div>
            <div className={css(styles.Sidebar_profileName)}>
              {currentUser.first_name.charAt(0).toUpperCase() + currentUser.first_name.slice(1)} {currentUser.last_name.charAt(0).toUpperCase() + currentUser.last_name.slice(1)}
            </div>
            <div className={css(styles.Sidebar_profileTitle)}>
              {currentUser.profile_info && currentUser.profile_info.area_of_expertise &&
                currentUser.profile_info.area_of_expertise.split(',').map((exp, i) => {
                  return (
                    <div key={`exp-${i}`}>{exp.toUpperCase()}</div>
                  )
                })}
              {canEdit &&
                <div className={css(styles.Sidebar_iconButtonFloat)}>
                  <Icon onClick={() => this.setState({ expertiseEditModalOpen: true })} name='edit' />
                </div>}
            </div>
            <div
              className={css(styles.Sidebar_sidebarHeader)}
            />

            {addedStartup && isStartupFounder &&
              this.renderAddStartup(addedStartup, canEdit)}

            <div
              onMouseEnter={() => this.setState({ affiliationEdit: true })}
              onMouseLeave={() => this.setState({ affiliationEdit: false })}
            >
              {currentUser.profile_info && currentUser.profile_info.location ? (
                <div
                  className={css(styles.Sidebar_sidebar)}
                >
                  {currentUser.profile_info && currentUser.profile_info.location_details ? (
                    <div><a className={css(styles.Sidebar_link)} href={currentUser.profile_info.location_details.startsWith('http') ? currentUser.profile_info.location_details : `//${currentUser.profile_info.location_details}`} target="_blank">{currentUser.profile_info.location}</a></div>
                  ) : (
                    <div>{currentUser.profile_info.location}</div>
                  )}
                  {canEdit &&
                    <div className={css(styles.Sidebar_iconButton)}>
                      <Icon onClick={() => this.setState({ affiliationEditModalOpen: true })} name='edit' />
                    </div>}
                  {!isStartupFounder &&
                    <div className={css(styles.Sidebar_sidebarSubtext)}>
                      {currentUser.profile_info.title}
                    </div>}
                  <div className={css(styles.Sidebar_sidebarSubtext)}>
                    {currentUser.profile_info.location_start_year || '?'} - {currentUser.profile_info.location_end_year || 'Present'}
                  </div>
                </div>
              ) : (
                <div className={css(styles.Sidebar_sidebar)}>
                  {canEdit ? (
                    <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ affiliationEditModalOpen: true })}>+ Add Affiliation</div>
                  ) : 'N/A'}
                </div>
              )}
            </div>
            {currentUser.profile_info && currentUser.profile_info.title !== "PhD Candidate" && (
              <>
                {!isStartupFounder &&
                  <div
                    className={css(styles.Sidebar_sidebarHeader)}
                  />}
                {currentUser.educations && currentUser.educations.length > 0 ? (
                  <>
                    {(addedStartup ? currentUser.educations.concat(addedStartup) : currentUser.educations).sort((obj1, obj2) => {
                      if (obj1.end_year === "Present" || Number(obj1.end_year) > Number(obj2.end_year)) {
                          return -1;
                      } else if (obj2.end_year === "Present" || Number(obj1.end_year) < Number(obj2.end_year)) {
                          return 1;
                      }

                      // Else go to the 2nd item
                      if (obj2.start_year === "?" || Number(obj1.start_year) < Number(obj2.start_year)) {
                          return -1;
                      } else if (obj1.start_year === "?" || Number(obj1.start_year) > Number(obj2.start_year)) {
                          return 1
                      } else { // nothing to split them
                          return 0;
                      }
                    }).map((education) => {
                      return education.startup_name ? (
                        this.renderAddStartup(addedStartup, canEdit)
                      ) : (
                        <div
                          key={`education-${education.id}`}
                          onMouseEnter={() => this.setState({ currentEducation: education, degree: education.degree, educationEdit: true })}
                          onMouseLeave={() => this.setState({ educationEdit: false })}
                          className={css(styles.Sidebar_sidebar)}
                        >
                          <div>{education.location}</div>
                          {canEdit &&
                            <div className={css(styles.Sidebar_iconButton)}>
                              <Icon onClick={() => this.setState({ educationEditModalOpen: true })} name='edit' />
                            </div>}
                          <div className={css(styles.Sidebar_sidebarSubtext)}>
                            {education.degree}{education.degree === 'PhD' && `, ${education.field_of_study}`}
                          </div>
                          <div className={css(styles.Sidebar_sidebarSubtext)}>
                            {education.start_year || '?'} - {education.end_year || 'Present'}
                          </div>
                          <br />
                        </div>
                      );
                    })}
                    {canEdit && (
                      <div className={css(styles.Sidebar_sidebar)}>
                        {canEdit && currentUser.profile_info.title !== "Postdoctoral Scientist" && !currentEducations.includes('Postdoctoral Scientist') &&
                          <div>
                            <br />
                            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEducation: undefined, degree: 'Postdoctoral Scientist', educationEditModalOpen: true })}>+ Add Postdoctoral training</div>
                          </div>
                        }
                        {canEdit && currentUser.profile_info.title !== "PhD Candidate" && !currentEducations.includes('PhD') &&
                          <div>
                            <br />
                            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEducation: undefined, degree: 'PhD', educationEditModalOpen: true })}>+ Add PhD</div>
                          </div>
                        }
                        {canEdit && currentUser.profile_info.title !== "PhD Candidate" && !currentEducations.includes('MD') &&
                          <div>
                            <br />
                            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEducation: undefined, degree: 'MD', educationEditModalOpen: true })}>+ Add MD</div>
                          </div>
                        }
                      </div>
                    )}
                  </>
                ) : (
                  <div className={css(styles.Sidebar_sidebar)}>
                    {canEdit && (
                      <>
                        {canEdit && currentUser.profile_info.title !== "Postdoctoral Scientist" &&
                          <div>
                            <br />
                            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEducation: undefined, degree: 'Postdoctoral Scientist', educationEditModalOpen: true })}>+ Add Postdoc</div>
                          </div>
                        }
                        {canEdit && currentUser.profile_info.title !== "PhD Candidate" &&
                          <div>
                            <br />
                            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEducation: undefined, degree: 'PhD', educationEditModalOpen: true })}>+ Add PhD</div>
                          </div>
                        }
                        {canEdit && currentUser.profile_info.title !== "PhD Candidate" &&
                          <div>
                            <br />
                            <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEducation: undefined, degree: 'MD', educationEditModalOpen: true })}>+ Add MD</div>
                          </div>
                        }
                      </>
                    )
                  }
                  </div>
                )}
              </>
            )}
            {!addedStartup && canEdit &&
              <div className={css(styles.Sidebar_sidebar)}>
                <br />
                <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ startupEditModalOpen: true })}>+ Add Startup</div>
              </div>
            }

            <div
              className={css(styles.Sidebar_sidebarHeader)}
              onMouseEnter={() => this.setState({ interestsEdit: true })}
              onMouseLeave={() => this.setState({ interestsEdit: false })}
            >
              INTERESTS
              {canEdit &&
                <div className={css(styles.Sidebar_iconButton)} onClick={() => this.setState({ interestEditModalOpen: true })}>
                  <Icon name='edit' />
                </div>}
            </div>
            {currentUser && currentUser.keywords && currentUser.keywords.length > 0 ? (
              <div className={css(styles.Sidebar_interestSidebar)}>
                {currentUser.keywords.map((keyword, i) => (
                  <div key={`keyword-${i}`} className={css(styles.Sidebar_keyword)}>
                    {keyword}
                  </div>
                ))}
              </div>
            ) : (
              <div className={css(styles.Sidebar_sidebar)}>
                {canEdit ? (
                  <div style={{ cursor: 'pointer' }} onClick={() => this.setState({ interestEditModalOpen: true })}>+ Add Keywords</div>
                ) : 'N/A'}
              </div>
            )}
          </div>
        )}
        {isAccount && gon.current_user && (
          <div className={css(styles.Sidebar_settingsGroup)}>
            <div className={css(styles.Sidebar_settingsLabelActive)}>Account</div>
{/*            <div className={css(styles.Sidebar_settingsLabel)}>Settings & Privacy</div>
            <div className={css(styles.Sidebar_settingsLabel)} onClick={() => window.location.href="/help"}>Need Help?</div>*/}
            <div className={css(styles.Sidebar_settingsLabel)} onClick={() => window.location.href="/sign_out"}>Sign out</div>
          </div>
        )}
        {isCompanyPage && company && (
          <div className={css(styles.Sidebar_companySection)}>
            <div className={css(styles.Sidebar_companyHeader)}>

            </div>
          </div>
        )}
        {isReviewerDashboard && (
          <div className={css(styles.Sidebar_opportunityList)}>
            <div className={css(styles.Sidebar_opportunityHeader)}>
              Published Opportunities
            </div>
            <div>
              {requestForProposals.length > 0 ? (
                requestForProposals.map((rfp) => {
                  return (
                    <div className={css(styles.Sidebar_opportunityRow)} key={`sidebar-rfp-${rfp.id}`}>
                      <div
                        onClick={() => setReviewerDashboardRFP(rfp)}
                        className={reviewerDashboardRFP.id === rfp.id ?
                          css(styles.Sidebar_opportunityTitleActive) :
                          css(styles.Sidebar_opportunityTitle)}
                      >
                        {rfp.title}
                      </div>
                      <div className={css(styles.Sidebar_opportunityCount)}>
                        {rfp.proposal_count}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className={css(styles.Sidebar_regularText)}
                >
                  No RFPs yet
                </div>
              )}
            </div>
          </div>
        )}
        {isStartingPage && (
          <Accordion className={css(styles.Sidebar_accordion)}>
            <Accordion.Title active={activeIndices.includes(0)} index={0} onClick={this.handleClick}>
              Research Area
            </Accordion.Title>
            <Accordion.Content active={activeIndices.includes(0)}>
              <Form>
                <Form.Group grouped className={css(styles.Sidebar_checkboxes)}>
                  {areasOfExpertise.map((researchArea) => {
                    return (
                      <div key={`research-area-${researchArea.key}`}>
                        <Form.Checkbox
                          label={
                            <label className={css(styles.Sidebar_checkboxLabel)}>{researchArea.text}</label>
                          }
                          name='researchArea'
                          value={researchArea.value}
                          onChange={this.handleChange}
                        />
                      </div>
                    );
                  })}
                  <div className={css(styles.Sidebar_showMoreText)} onClick={this.showMoreResearchAreas}>
                    <Icon name={researchAreaShowMore ? "minus" : "plus"} className={css(styles.Sidebar_showMoreIcon)} />
                    {researchAreaShowMore ? "SHOW LESS" : "SHOW MORE"}
                  </div>
                </Form.Group>
              </Form>
            </Accordion.Content>
            <Accordion.Title active={activeIndices.includes(1)} index={1} onClick={this.handleClick}>
              Innovation Type
            </Accordion.Title>
            <Accordion.Content active={activeIndices.includes(1)}>
              <Form>
                <Form.Group grouped className={css(styles.Sidebar_checkboxes)}>
                  {innovationTypes.map((innovationType) => {
                    return (
                      <div key={`innovation-type-${innovationType.key}`}>
                        <Form.Checkbox
                          label={
                            <label className={css(styles.Sidebar_checkboxLabel)}>{innovationType.text}</label>
                          }
                          name='innovationType'
                          value={innovationType.value}
                          onChange={this.handleChange}
                        />
                      </div>
                    );
                  })}
                  <div className={css(styles.Sidebar_showMoreText)} onClick={this.showMoreInnovationTypes}>
                    <Icon name={innovationTypesShowMore ? "minus" : "plus"} className={css(styles.Sidebar_showMoreIcon)} />
                    {innovationTypesShowMore ? "SHOW LESS" : "SHOW MORE"}
                  </div>
                </Form.Group>
              </Form>
            </Accordion.Content>
          </Accordion>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentRFP: state.defaultReducer.currentRFP,
    currentCompany: state.defaultReducer.currentCompany,
    currentUser: state.profiles.currentUser,
    requestForProposals: state.company.requestForProposals,
    reviewerDashboardRFP: state.company.reviewerDashboardRFP,
  };
};

const mapDispatchToProps = {
  addFilter: addFilterAction,
  removeFilter: removeFilterAction,
  fetchUser: fetchUserAction,
  setReviewerDashboardRFP: setReviewerDashboardRFPAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
