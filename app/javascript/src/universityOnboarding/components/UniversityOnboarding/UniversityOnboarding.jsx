import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { Container, Form, Radio, Grid, Dropdown, Button, Icon } from 'semantic-ui-react';
import _, { debounce } from 'lodash';

import { COLORS, WINDOW_DIMENSIONS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import { authenticityToken, getCookie } from '../../../marketplace/utils/requests';

const { TABLET_LANDSCAPE_MEDIA_QUERY, MOBILE_MEDIA_QUERY } = WINDOW_DIMENSIONS;


const styles = StyleSheet.create({
  UniversityOnboarding_container: {
    marginBottom: '100px',
    [MOBILE_MEDIA_QUERY]: {
      padding: '0'
    },
  },
  UniversityOnboarding_logoBanner: {
    textAlign: 'center',
    backgroundColor: COLORS.snowWhite,
    paddingTop: '15px',
    paddingBottom: '15px',
    marginBottom: '50px',
  },
  UniversityOnboarding_stepTab: {
    width: '33%',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '16px',
    color: COLORS.lightGray,
    paddingBottom: '33px',
    borderBottom: `1px solid ${COLORS.lightGray}`,
    [MOBILE_MEDIA_QUERY]: {
      paddingBottom: '12px',
    },
  },
  UniversityOnboarding_steps: {
    [MOBILE_MEDIA_QUERY]: {
      marginLeft: '0'
    },
  },
  UniversityOnboarding_activeTab: {
    color: COLORS.lightBlack,
    borderBottom: `2px solid ${COLORS.lightBlue}`,
  },
  UniversityOnboarding_stepContainer: {
    textAlign: 'center',
    width: '60%',
    margin: 'auto',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  },
  UniversityOnboarding_step1Description: {
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
  UniversityOnboarding_subdescription: {
    fontSize: '14px',
    textAlign: 'left',
    width: '90%',
    margin: '0 auto 30px',
    color: COLORS.lightBlack,
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  },
  UniversityOnboarding_step2Description: {
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
  UniversityOnboarding_step2Subdescription: {
    margin: '0 auto 50px',
    width: '90%',
    textAlign: 'left',
    color: COLORS.darkGray,
    fontSize: '13px',
    lineHeight: '24px',
  },
  UniversityOnboarding_radioGroup: {
    textAlign: 'left',
    marginLeft: '30px',
  },
  UniversityOnboarding_inputContainer: {
    width: '90%',
    margin: 'auto',
  },
  UniversityOnboarding_fieldSublabel: {
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
  UniversityOnboarding_dropdown: {
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
  UniversityOnboarding_input: {
    width: '90%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    marginTop: '10px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  UniversityOnboarding_radioButton: {
    marginBottom: '0px',
  },
  UniversityOnboarding_leftInput: {
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
  UniversityOnboarding_rightInput: {
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
  UniversityOnboarding_radioLabel: {
    fontSize: '14px',
  },
  UniversityOnboarding_continueButtonHolder: {
    textAlign: 'left',
    display: 'flex',
    [MOBILE_MEDIA_QUERY]: {
      marginTop: '30px',
      flexDirection: 'column-reverse'
    },
  },
  UniversityOnboarding_backButton: {
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
  UniversityOnboarding_continueButton: {
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
  UniversityOnboarding_expertiseDropdown: {
    width: '90%',
    margin: 'auto',
    fontSize: '14px',
    minHeight: '48px',
    paddingTop: '3px',
    display: 'flex',
    alignItems: 'center',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    },
  }
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

class UniversityOnboarding extends PureComponent {
  state = {
    currentStep: 1,
    title: '',
    location: '',
    expertise: '',
    searchQuery: '',
    loadingSearch: false,
    universityOptions: [],
    loadingLocationSearch: false,
    locationSearchQuery: '',
    otherSpecialty: '',
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

  givenExpertiseOptionValues = () => {
    return  _.chain(expertiseOptions)
             .map('value')
             .without('other_specialty')
             .value()
  }

  handleExpertise = (e, selection) => {
    const value = selection.value.includes('allAreas') ?
                    this.givenExpertiseOptionValues() :
                    selection.value;

    this.setState({
      expertise: value,
    });
  };

  handleOtherSpecialty = (e, selection) => {
    this.setState({
      otherSpecialty: e.target.value,
    })
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title,
      location,
      expertise,
      otherSpecialty,
    } = this.state;

    this.setState({
      isSubmitting: true,
      errors: {},
      hasSubmitted: true,
    });

    const formData = new FormData();
    formData.append('user_profile_info[title]', title);
    formData.append('user_profile_info[location]', location);
    formData.append('user_profile_info[area_of_expertise]', expertise.map((exp) => exp.replace('other_specialty', otherSpecialty)));

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
      isSubmitting,
      searchQuery,
      loadingSearch,
      loadingLocationSearch,
      locationSearchQuery,
      universityOptions,
      otherSpecialty,
    } = this.state;

    switch (currentStep) {
      case 1:
        return (
          <div key={currentStep}>
            <div className={css(styles.UniversityOnboarding_step1Description)}>
              Position
            </div>
            <div className={css(styles.UniversityOnboarding_subdescription)}>
              What best describes your role?
            </div>
            <div className="custom-dropdown">
              <Dropdown
                className={css(styles.UniversityOnboarding_dropdown)}
                icon="chevron down"
                placeholder='Position'
                fluid
                selection
                search
                options={titleOptions}
                onChange={this.handleTitle}
              />
            </div>
            <div className={css(styles.UniversityOnboarding_continueButtonHolder)}> 
              <Button
                className={css(styles.UniversityOnboarding_continueButton)}
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
          <div key={currentStep}>
            <div className={css(styles.UniversityOnboarding_step2Description)}>
              Research Institution
            </div>
            <div className={css(styles.UniversityOnboarding_subdescription)}>
              Where does your faculty conduct its research?
            </div>
            <div className="custom-dropdown">
              <Dropdown
                icon={<Icon name='search'/>}
                className={css(styles.UniversityOnboarding_dropdown, styles.UniversityOnboarding_collegeSearch)}
                placeholder='Search Institutions'
                fluid
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
            <div className={css(styles.UniversityOnboarding_continueButtonHolder)}> 
              <Button
                className={css(styles.UniversityOnboarding_backButton)}
                type='submit'
                onClick={this.decrementStep}
              >
                Back
              </Button>
              <Button
                className={css(styles.UniversityOnboarding_continueButton)}
                type='submit'
                onClick={this.incrementStep}
                disabled={!location || location.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 3:
        const allAreasSelected = _.isEqual(this.state.expertise, this.givenExpertiseOptionValues());
        const options = allAreasSelected ?
                          expertiseOptions : // exclude 'All areas' option
                          [{ key: 'allAreas', text: 'All areas', value: 'allAreas'}, ...expertiseOptions]

        return (
          <div key={currentStep}>
            <div className={css(styles.UniversityOnboarding_step2Description)}>
              Faculty Expertise
            </div>
            <div className={css(styles.UniversityOnboarding_subdescription)}>
              Where do you focus your efforts on behalf of faculty?
            </div>
            <div className="onboarding-dropdown">
              <Dropdown
                className={css(styles.UniversityOnboarding_expertiseDropdown)}
                icon="chevron down"
                placeholder='Area of expertise'
                fluid
                selection
                multiple
                value={this.state.expertise}
                options={options}
                onChange={this.handleExpertise}
              />
            </div>
            {expertise.includes('other_specialty') &&
              <input
                className={css(styles.UniversityOnboarding_input)}
                placeholder='Specify your specialty...'
                value={otherSpecialty}
                onChange={this.handleOtherSpecialty}
              />}
            <div className={css(styles.UniversityOnboarding_continueButtonHolder)}> 
              <Button
                className={css(styles.UniversityOnboarding_backButton)}
                type='submit'
                onClick={this.decrementStep}
              >
                Back
              </Button>
              <Button
                className={css(styles.UniversityOnboarding_continueButton)}
                type='submit'
                disabled={isSubmitting}
                loading={isSubmitting}
                disabled={
                  !expertise ||
                  expertise.length === 0,
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
        <div className={css(styles.UniversityOnboarding_logoBanner)}>
          <img src={haloLogo} />
        </div>
        <Container className={css(styles.UniversityOnboarding_container)}>
          <Grid>
            <Grid.Row className={css(styles.UniversityOnboarding_steps)}>
              <Grid.Column
                className={css(
                  styles.UniversityOnboarding_stepTab,
                  currentStep === 1 && styles.UniversityOnboarding_activeTab
                )}>
                Step 1: Position
              </Grid.Column>
              <Grid.Column
                className={css(
                  styles.UniversityOnboarding_stepTab,
                  currentStep === 2 && styles.UniversityOnboarding_activeTab
                )}>
                Step 2: Institution
              </Grid.Column>
              <Grid.Column
                className={css(
                  styles.UniversityOnboarding_stepTab,
                  currentStep === 3 && styles.UniversityOnboarding_activeTab
                )}>
                Step 3: Faculty Expertise
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div className={css(styles.UniversityOnboarding_stepContainer)}>
            {this.renderStep()}
          </div>
        </Container>
      </div>
    );
  }
}

export default UniversityOnboarding;
