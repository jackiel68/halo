import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import _, { debounce } from 'lodash';
import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  AffiliationEditModal_modal: {
    overflow: 'visible',
  },
  AffiliationEditModal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  AffiliationEditModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  AffiliationEditModal_modalTextInput: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: COLORS.lightBlack,
    borderColor: COLORS.gray,
  },
  AffiliationEditModal_modalSubmitButton: {
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    display: 'inline-block',
    height: '48px',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '5px 50px',
  },
  AffiliationEditModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  AffiliationEditModal_modalCancelButton: {
    height: '48px',
    textAlign: 'center',
    color: COLORS.lightBlack,
    backgroundColor: COLORS.white,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '5px 50px',
  },
  AffiliationEditModal_dropdown: {
    width: '100%',
    display: 'flex',
    height: '48px',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: COLORS.gray,
    margin: 'auto',
    fontSize: '14px',
  },
});

const yearOptions = _.range(new Date().getFullYear(), 1950, -1).map((year) => {
  return {
    key: year,
    text: year,
    value: String(year),
  };
});

class AffiliationEditModal extends PureComponent {
  constructor(props) {
    super(props);
    const profileInfo = props.currentUser.profile_info || {};
    this.state = {
      affiliationEditModalLoading: false,
      loadingUniversities: false,
      universityOptions: profileInfo.location ? [{ key: profileInfo.location, value: profileInfo.location, text: profileInfo.location }] : [],
      location: profileInfo.location,
      locationStartYear: profileInfo.location_start_year,
      locationEndYear: profileInfo.location_end_year,
      loadingSearch: false,
      searchQuery: profileInfo.location ? profileInfo.location : '',
    };
  }

  async componentDidMount() {
    // await this.fetchUniversities();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      const profileInfo = this.props.currentUser.profile_info || {};
      this.setState({
        location: profileInfo.location,
        locationStartYear: profileInfo.location_start_year,
        locationEndYear: profileInfo.location_end_year,
      });
    }
  }

  fetchUniversities = async () => {
    this.setState({ loadingUniversities: true });
    const response = await fetch('/universities', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();
    const universities = responseJson.universities;

    this.setState({
      universityOptions: universities,
      loadingUniversities: false,
    });
  }

  handleSubmitMessage = async (e) => {
    const {
      closeModal,
      currentUser,
    } = this.props;

    e.preventDefault();

    const {
      location,
      locationStartYear,
      locationEndYear,
    } = this.state;

    this.setState({
      affiliationEditModalLoading: true,
    });

    const profileInfo = currentUser.profile_info || {};

    const formData = new FormData();
    formData.append('location', location);
    if (locationStartYear) {
      formData.append('location_start_year', locationStartYear);
    }
    if (locationEndYear) {
      formData.append('location_end_year', locationEndYear);
    }

    formData.append('user_id', currentUser.id);

    try {
      const textResponse = await fetch(`/user_profile_infos/${currentUser.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await textResponse.json();
      if (!responseJson.success) {
        this.setState({
          affiliationEditModalLoading: false,
        });
      } else {
        this.setState({
          affiliationEditModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ affiliationEditModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  handleYears = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  handleLocation = (e, selection) => {
    this.setState({
      searchQuery: selection.value,
      location: selection.value,
    });
  };

  handleSearchQuery = (options, query) => {
    const { universityOptions, location } = this.state;
    return _.uniqBy([{ key: location, text: location, value: location }].concat(universityOptions), 'key');
  }

  universitySearch = debounce(async (name) => {
    this.setState({ loadingSearch: true });
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
      loadingSearch: false,
    });
  }, 500, { leading: true, trailing: true });

  handleSearchChange = async (e, { searchQuery }) => {
    this.universitySearch(searchQuery);

    this.setState({
      searchQuery,
    });
  };

  render() {
    const {
      open,
      proposal,
      closeModal,
    } = this.props;

    const {
      location,
      locationStartYear,
      locationEndYear,
      loadingUniversities,
      universityOptions,
      affiliationEditModalLoading,
      loadingSearch,
      searchQuery,
    } = this.state;

    const validAffiliation = location && !loadingUniversities && !affiliationEditModalLoading;
    return (
      <Modal
        open={open}
        onClose={closeModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.AffiliationEditModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.AffiliationEditModal_modalHeader)}>
            {location ? 'Affiliation' : 'Add Affiliation'}
          </div>
          <div className={css(styles.AffiliationEditModal_modalFieldLabel)}>
            Place of Research
          </div>
          <Dropdown
            className={css(styles.AffiliationEditModal_dropdown)}
            placeholder='i.e. University, Research Institution, etc.'
            fluid
            icon='search'
            selection
            open={universityOptions.length > 0 && !location}
            closeOnChange
            search={this.handleSearchQuery}
            value={location || ''}
            options={universityOptions}
            onChange={this.handleLocation}
            searchQuery={searchQuery}
            onSearchChange={this.handleSearchChange}
            loading={loadingSearch}
          />
          <div style={{ width: '48%', marginRight: '4%', display: 'inline-block' }}>
            <div className={css(styles.AffiliationEditModal_modalFieldLabel)}>
              Start Year
            </div>
            <Dropdown
              className={css(styles.AffiliationEditModal_dropdown)}
              icon="chevron down"
              fluid
              selection
              placeholder="Start Year"
              value={locationStartYear || ''}
              options={yearOptions}
              onChange={(e, selection) => this.handleYears(e, selection, 'locationStartYear')}
            />
          </div>
          <div style={{ width: '48%', display: 'inline-block' }}>
            <div className={css(styles.AffiliationEditModal_modalFieldLabel)}>
              End Year
            </div>
            <Dropdown
              className={css(styles.AffiliationEditModal_dropdown)}
              icon="chevron down"
              fluid
              selection
              placeholder="End Year"
              value={locationEndYear || ''}
              options={[{ key: 'Present', text: 'Present', value: 'Present'}].concat(yearOptions)}
              onChange={(e, selection) => this.handleYears(e, selection, 'locationEndYear')}
            />
          </div>
          <div className={css(styles.AffiliationEditModal_modalButtonHolder)}>
            <Button
              className={css(styles.AffiliationEditModal_modalCancelButton)}
              type='submit'
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.AffiliationEditModal_modalSubmitButton)}
              type='submit'
              disabled={!validAffiliation}
              onClick={this.handleSubmitMessage}
            >
              Save
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

AffiliationEditModal.propTypes = {
  currentUser: PropTypes.object,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default AffiliationEditModal;
