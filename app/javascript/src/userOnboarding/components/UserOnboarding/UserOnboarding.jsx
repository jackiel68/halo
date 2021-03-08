import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { Container, Form, Radio, Grid, Dropdown, Button, Icon } from 'semantic-ui-react';
import _, { debounce } from 'lodash';
import classnames from "classnames";
import { COLORS, WINDOW_DIMENSIONS } from '../../../../constants';
import { authenticityToken, getCookie } from '../../../marketplace/utils/requests';

import haloLogo from '../../../../images/logos/halo_logo.svg';

const { TABLET_LANDSCAPE_MEDIA_QUERY, MOBILE_MEDIA_QUERY } = WINDOW_DIMENSIONS;


const styles = StyleSheet.create({
  UserOnboarding_container: {
    marginBottom: '100px',
    [MOBILE_MEDIA_QUERY]: {
      margin: '0'
    },
  },
  UserOnboarding_logoBanner: {
    textAlign: 'center',
    backgroundColor: COLORS.snowWhite,
    paddingTop: '15px',
    paddingBottom: '15px',
    marginBottom: '50px',
  },
  UserOnboarding_stepTab: {
    textAlign: 'center',
    width: '33%',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '16px',
    color: COLORS.lightGray,
    paddingBottom: '33px',
    paddingLeft: '0',
    paddingRight: '0',
    borderBottom: `1px solid ${COLORS.lightGray}`,
    [MOBILE_MEDIA_QUERY]: {
      paddingBottom: '12px',
    },
  },
  UserOnboarding_steps: {
    [MOBILE_MEDIA_QUERY]: {
      marginLeft: '0'
    },
  },
  UserOnboarding_activeTab: {
    color: COLORS.lightBlack,
    borderBottom: `2px solid ${COLORS.lightBlue}`,
  },
  UserOnboarding_stepContainer: {
    textAlign: 'center',
    width: '60%',
    margin: 'auto',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  },
  UserOnboarding_step1Description: {
    margin: '50px auto 5px',
    color: COLORS.lightBlack,
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 'bold',
    textAlign: 'left',
    width: '90%',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UserOnboarding_subdescription: {
    fontSize: '14px',
    textAlign: 'left',
    width: '90%',
    margin: '0 auto 30px',
    color: COLORS.lightBlack,
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  },
  UserOnboarding_step2Description: {
    margin: '50px auto 5px',
    width: '90%',
    textAlign: 'left',
    color: COLORS.lightBlack,
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 'bold',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  },
  UserOnboarding_step2Subdescription: {
    margin: '0 auto 50px',
    width: '90%',
    textAlign: 'left',
    color: COLORS.darkGray,
    fontSize: '13px',
    lineHeight: '24px',
  },
  UserOnboarding_radioGroup: {
    textAlign: 'left',
    marginLeft: '30px',
  },
  UserOnboarding_fieldLabel: {
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.darkGray,
    margin: '0 auto 5px',
    width: '90%',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UserOnboarding_inputContainer: {
    width: '90%',
    margin: 'auto',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UserOnboarding_fieldSublabel: {
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: '24px',
    color: COLORS.lightGray,
    margin: '0 auto 5px',
    width: '90%',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UserOnboarding_dropdown: {
    width: '90%',
    margin: 'auto',
    flexWrap: 'wrap',
    fontSize: '14px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UserOnboarding_input: {
    width: '90%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    marginBottom: '10px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UserOnboarding_radioButton: {
    marginBottom: '0px',
  },
  UserOnboarding_leftInput: {
    width: '48%',
    marginRight: '4%',
    display: 'inline-block',
    padding: '10px',
    fontSize: '14px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      border: '1px solid',
      borderColor: COLORS.inputBorderGray,
      borderRadius: '4px',
      marginBottom: '10px'
    },
  },
  UserOnboarding_rightInput: {
    width: '48%',
    display: 'inline-block',
    padding: '10px',
    fontSize: '14px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      border: '1px solid',
      borderColor: COLORS.inputBorderGray,
      borderRadius: '4px'
    },
  },
  UserOnboarding_radioLabel: {
    fontSize: '14px',
  },
  UserOnboarding_continueButtonHolder: {
    textAlign: 'left',
    display: 'flex',
    [MOBILE_MEDIA_QUERY]: {
      marginTop: '30px',
      flexDirection: 'column-reverse'
    },
  },
  UserOnboarding_continueButton: {
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    width: '166px',
    height: '48px',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    marginLeft: '4%',
    marginTop: '50px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      margin: '0'
    },
  },
  UserOnboarding_backButton: {
    backgroundColor: COLORS.white,
    width: '166px',
    height: '48px',
    textAlign: 'center',
    color: COLORS.lightBlack,
    border: `1px solid ${COLORS.lightGray}`,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    marginLeft: '4%',
    marginTop: '50px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      marginLeft: '0',
      marginTop: '8px'
    },
  },
  UserOnboarding_searchDropdown: {
    width: '90%',
    fontSize: '14px',
    minHeight: '48px',
    paddingTop: '8px',
    margin: 'auto',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  },
  UserOnboarding_searchContainer: {
    display: 'flex'
  },
  UserOnboarding_topPadding: {
    paddingTop: '16px',
  },
});

const yearOptions = _.range(new Date().getFullYear(), 1950, -1).map((year) => {
  return {
    key: year,
    text: year,
    value: String(year),
  };
});

const titleOptions = gon.user_title_options;

const expertiseOptions = gon.areas_of_expertise;

const keywordOptions = gon.research_keywords;

class UserOnboarding extends PureComponent {
  state = {
    currentStep: 1,
    title: '',
    location: '',
    startYear: '',
    expertise: '',
    companyName: '',
    keywords: [],
    searchQuery: '',
    loadingSearch: false,
    keywordSearchOptions: [],
    universityOptions: [],
    loadingLocationSearch: false,
    locationSearchQuery: '',
  };

  incrementStep = () => {
    this.setState((prevState) => {
      return {
        currentStep: prevState.currentStep + 1,
      };
    })
  };

  decrementStep = () => {
    this.setState((prevState) => {
      return {
        currentStep: prevState.currentStep - 1,
      };
    })
  };

  handleTitle = (e, selection) => {
    this.setState({
      title: selection.value,
    });
  };

  handleCompanyName = (e, selection) => {
    this.setState({
      companyName: e.target.value,
    })
  };

  handleCompanyURL = (e, selection) => {
    this.setState({
      companyURL: e.target.value,
    })
  };

  handleOtherSpecialty = (e, selection) => {
    this.setState({
      otherSpecialty: e.target.value,
    })
  };

  handleLocation = (e, selection) => {
    this.setState({
      locationSearchQuery: selection.value,
      location: selection.value,
    });
  };

  handleLocationSearchQuery = (options, query) => {
    const { universityOptions, location } = this.state;

    return _.uniqBy(
      [{ key: location, text: location, value: location }].concat(universityOptions), 'value')
      .filter(university => university.value.length > 0);
  }

  universitySearch = debounce(async (name) => {
    this.setState({ loadingLocationSearch: true });
    const response = await fetch(`/universities/search?name=${name}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();
    const universities = responseJson.universities;

    this.setState({
      location: '',
      universityOptions: universities,
      loadingLocationSearch: false,
    });
  }, 500, { leading: true, trailing: true });

  handleLocationSearchChange = async (e, { searchQuery }) => {
    this.universitySearch(searchQuery);

    this.setState({
      locationSearchQuery: searchQuery,
    });
  };

  handleExpertise = (e, selection) => {
    this.setState({
      expertise: selection.value,
    });
  };

  handleKeywords = (e, selection) => {
    this.setState((prevState) => {
      if (selection.value.length > 6) {
        return {
          keywords: prevState.keywords,
          searchQuery: '',
        };
      } else {
        return {
          keywords: selection.value || [],
          searchQuery: '',
        };
      }
    });
  };

  handleSearchQuery = (options, query) => {
    return this.state.keywordSearchOptions;
  }

  keywordSearch = debounce(async (researchType) => {
    const { keywords } = this.state;
    this.setState({ loadingSearch: true });
    const response = await fetch(`/research_keywords/search?research_type=${researchType}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();
    const researchKeywords = responseJson.research_keywords;

    this.setState({
      keywordSearchOptions: _.uniqBy(researchKeywords.concat(keywords.map((keyword) => {
        return {
          key: keyword,
          text: keyword,
          value: keyword,
        };
      })), 'key'),
      loadingSearch: false,
    });
  }, 500, { leading: true, trailing: true });

  handleSearchChange = async (e, { searchQuery }) => {
    this.keywordSearch(searchQuery);

    this.setState({
      searchQuery,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title,
      location,
      expertise,
      keywords,
      companyName,
      companyURL,
      startYear,
      otherSpecialty,
    } = this.state;

    this.setState({
      isSubmitting: true,
      errors: {},
      hasSubmitted: true,
    });


    const formData = new FormData();
    formData.append('user_profile_info[title]', title);

    if (title === 'startup_founder') {
      formData.append('startup[startup_name]', companyName);
      formData.append('startup[url]', companyURL);
      formData.append('startup[start_year]', startYear);
    } else {
      formData.append('user_profile_info[location]', location);
      formData.append('user_profile_info[location_start_year]', startYear);
    }
    formData.append('user_profile_info[keywords]', keywords);
    formData.append('user_profile_info[area_of_expertise]', expertise.replace('other_specialty', otherSpecialty));

    try {
      const onboardingResponse = await fetch('/onboarding', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await onboardingResponse.json();
      if (responseJson.errors) {
        this.setState({
          isSubmitting: false,
          errors: responseJson.errors,
        });
      } else {
        window.location.href = '/research/water';
      }
    } catch(err) {
      this.setState({ isSubmitting: false });
    }
  }

  handleYears = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  renderStep = () => {
    const {
      currentStep,
      title,
      location,
      expertise,
      keywords,
      companyName,
      companyURL,
      isSubmitting,
      searchQuery,
      loadingSearch,
      keywordSearchOptions,
      startYear,
      loadingLocationSearch,
      locationSearchQuery,
      universityOptions,
      otherSpecialty,
    } = this.state;

    const step2Disabled = title === 'startup_founder' ? (
      !companyName || !startYear || companyName.length === 0 || startYear.length === 0
    ) : (
      !location || !startYear || location.length === 0 || startYear.length === 0
    )

    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className={css(styles.UserOnboarding_step1Description)}>
              Tell us about yourself.
            </div>
            <div className={css(styles.UserOnboarding_subdescription)}>

            </div>
            <div className={css(styles.UserOnboarding_fieldLabel)}>
              What best describes your role?
            </div>
            <div className="custom-dropdown">
              <Dropdown
                icon="chevron down"
                className={css(styles.UserOnboarding_dropdown)}
                placeholder='Select a role'
                fluid
                selection
                value={title}
                search
                options={titleOptions}
                onChange={this.handleTitle}
              />
            </div>
            <div className={css(styles.UserOnboarding_continueButtonHolder)}> 
              <Button
                className={css(styles.UserOnboarding_continueButton)}
                type='submit'
                onClick={this.incrementStep}
                disabled={!title || title.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className={css(styles.UserOnboarding_step2Description)}>
              Lab
            </div>
            <div className={css(styles.UserOnboarding_subdescription)}>
              {title === 'startup_founder' ? 'Tell us about your startup' : 'Where do you conduct your research?'}
            </div>
            <div className={css(styles.UserOnboarding_fieldLabel)}>
              {title === 'startup_founder' ? 'Company Name' : 'Research Institution'}
            </div>
            {title === 'startup_founder' ? (
              <input
                className={css(styles.UserOnboarding_input)}
                placeholder='Company Name'
                value={companyName}
                onChange={this.handleCompanyName}
              />
            ) : (
              <div className={classnames(css(styles.UserOnboarding_searchContainer), "onboarding-dropdown")}>
                <Dropdown
                  className={css(styles.UserOnboarding_searchDropdown, styles.UserOnboarding_topPadding)}
                  placeholder='Search institutions'
                  fluid
                  icon={<Icon name='search'/>}
                  selection
                  open={universityOptions.length > 0 && !location}
                  closeOnChange
                  search={this.handleLocationSearchQuery}
                  options={universityOptions}
                  onChange={this.handleLocation}
                  searchQuery={locationSearchQuery}
                  onSearchChange={this.handleLocationSearchChange}
                  loading={loadingLocationSearch}
                />
              </div>
            )}
            <br />
            <div className={css(styles.UserOnboarding_fieldLabel)}>
              Start Year
            </div>
            <div className="custom-dropdown" style={{ paddingBottom: title === 'startup_founder' ? '10px' : '0' }}>
              <Dropdown
                icon="chevron down"
                className={css(styles.UserOnboarding_dropdown)}
                fluid
                selection
                placeholder={title === 'startup_founder' ? 'Year Founded' : 'Select the year you started here'}
                value={startYear || ''}
                options={yearOptions}
                onChange={(e, selection) => this.handleYears(e, selection, 'startYear')}
              />
            </div>
            {title === 'startup_founder' &&
              <>
                <input
                  className={css(styles.UserOnboarding_input)}
                  placeholder='Company URL'
                  value={companyURL}
                  onChange={this.handleCompanyURL}
                />
              </> }
            <div className={css(styles.UserOnboarding_continueButtonHolder)}> 
              <Button
                className={css(styles.UserOnboarding_backButton)}
                type='submit'
                onClick={this.decrementStep}
              >
                Back
              </Button>
              <Button
                className={css(styles.UserOnboarding_continueButton)}
                type='submit'
                onClick={this.incrementStep}
                disabled={step2Disabled}
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className={css(styles.UserOnboarding_step2Description)}>
              Research Area
            </div>
            <div className={css(styles.UserOnboarding_subdescription)}>
              This will appear on your profile to help industry partners find you.
              Don’t worry, you can always change this later.
            </div>
            <div className={css(styles.UserOnboarding_fieldLabel)}>
              Research Area
            </div>
            <div className="custom-dropdown">
              <Dropdown
                icon="chevron down"
                className={css(styles.UserOnboarding_dropdown)}
                placeholder='Research Area (select one)'
                fluid
                selection
                options={expertiseOptions}
                onChange={this.handleExpertise}
              />
            </div>
            {expertise === 'other_specialty' &&
              <input
                className={css(styles.UserOnboarding_input)}
                placeholder='Specify your specialty...'
                value={otherSpecialty}
                onChange={this.handleOtherSpecialty}
              />}
            <br />
            <div className={css(styles.UserOnboarding_fieldLabel)}>
              Select up to 6 keywords that describe your lab research.
            </div>
            <div className={classnames(css(styles.UserOnboarding_searchContainer), "onboarding-dropdown")}>
              <Dropdown
                className={css(styles.UserOnboarding_searchDropdown)}
                placeholder='Search keywords'
                fluid
                selection
                multiple
                icon={<Icon name='search'/>}
                open={searchQuery.length > 0 && this.state.keywordSearchOpen}
                onBlur={() => this.setState({ keywordSearchOpen: false })}
                onFocus={() => this.setState({ keywordSearchOpen: true })}
                search={this.handleSearchQuery}
                value={keywords}
                searchQuery={searchQuery}
                options={keywordSearchOptions}
                onChange={this.handleKeywords}
                onSearchChange={this.handleSearchChange}
                loading={loadingSearch}
              />
            </div>
            <div className={css(styles.UserOnboarding_continueButtonHolder)}> 
              <Button
                className={css(styles.UserOnboarding_backButton)}
                type='submit'
                onClick={this.decrementStep}
              >
                Back
              </Button>
              <Button
                className={css(styles.UserOnboarding_continueButton)}
                type='submit'
                disabled={isSubmitting}
                loading={isSubmitting}
                disabled={
                  !expertise ||
                  expertise.length === 0 ||
                  (expertise.includes('other_specialty') && !otherSpecialty)
                }
                onClick={this.handleSubmit}
              >
                Finish
              </Button>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  render() {
    const { currentStep } = this.state;

    return (
      <div>
        <div className={css(styles.UserOnboarding_logoBanner)}>
          <img src={haloLogo} />
        </div>
        <Container className={css(styles.UserOnboarding_container)}>
          <Grid>
            <Grid.Row className={css(styles.UserOnboarding_steps)}>
              <Grid.Column
                className={css(
                  styles.UserOnboarding_stepTab,
                  currentStep === 1 && styles.UserOnboarding_activeTab
                )}>
                Step 1: Role
              </Grid.Column>
              <Grid.Column
                className={css(
                  styles.UserOnboarding_stepTab,
                  currentStep === 2 && styles.UserOnboarding_activeTab
                )}>
                Step 2: Lab
              </Grid.Column>
              <Grid.Column
                className={css(
                  styles.UserOnboarding_stepTab,
                  currentStep === 3 && styles.UserOnboarding_activeTab
                )}>
                Step 3: Research Area
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div className={css(styles.UserOnboarding_stepContainer)}>
            {this.renderStep()}
          </div>
        </Container>
      </div>
    );
  }
}

export default UserOnboarding;
