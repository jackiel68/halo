import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import _, { debounce } from 'lodash';
import { COLORS } from '../../../../constants';
import { styles as modalStyles } from '../Modal'
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  EducationEditModal_modal: {
    overflow: 'visible',
  },
  EducationEditModal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  EducationEditModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  EducationEditModal_modalTextInput: {
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
  EducationEditModal_modalSubmitButton: {
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
  EducationEditModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  EducationEditModal_modalCancelButton: {
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
  EducationEditModal_dropdown: {
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

class EducationEditModal extends PureComponent {
  constructor(props) {
    super(props);

    const education = props.education || {};
    this.state = {
      isNew: _.isEmpty(education),
      educationEditModalLoading: false,
      loadingUniversities: false,
      universityOptions: education.location ? [{ key: education.location, value: education.location, text: education.location }] : [],
      location: education.location,
      startYear: education.start_year,
      endYear: education.end_year,
      searchQuery: education.location ? education.location : '',
      fieldOfStudy: education.field_of_study,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.education !== this.props.education) {
      const education = this.props.education || {};
      this.setState({
        isNew: _.isEmpty(education),
        universityOptions: education.location ? [{ key: education.location, value: education.location, text: education.location }] : [],
        location: education.location,
        startYear: education.start_year,
        endYear: education.end_year,
        searchQuery: education.location ? education.location : '',
        fieldOfStudy: education.field_of_study,
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
      degree,
    } = this.props;

    e.preventDefault();

    const {
      location,
      startYear,
      endYear,
      isNew,
      fieldOfStudy,
    } = this.state;

    this.setState({
      educationEditModalLoading: true,
    });

    const education = this.props.education || {};

    const formData = new FormData();
    formData.append('location', location);
    if (degree) {
      formData.append('degree', degree);
    }
    if (startYear) {
      formData.append('start_year', startYear);
    }
    if (endYear) {
      formData.append('end_year', endYear);
    }
    if (fieldOfStudy) {
      formData.append('field_of_study', fieldOfStudy);
    }

    try {
      const educationResponse = await fetch(
        isNew ? '/educations' : `/educations/${education.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'X-CSRF-Token': authenticityToken(),
          }
        }
      );
      const responseJson = await educationResponse.json();
      if (!responseJson.success) {
        this.setState({
          educationEditModalLoading: false,
        });
      } else {
        this.setState({
          educationEditModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ educationEditModalLoading: false });
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
    return _.uniqBy(
      [{ key: location, text: location, value: location }].concat(universityOptions), 'value')
      .filter(university => university.value && university.value.length > 0);
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

  deleteEducation = async () => {
    if (confirm("Are you sure you want to delete that?")) {
      await fetch(`/educations/${this.props.education.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      window.location.reload();
    }
  }

  render() {
    const {
      open,
      degree,
      closeModal,
      education
    } = this.props;

    const {
      location,
      startYear,
      endYear,
      loadingUniversities,
      universityOptions,
      isNew,
      educationEditModalLoading,
      loadingSearch,
      searchQuery,
      fieldOfStudy,
    } = this.state;

    const validEducation = location && !loadingUniversities && !educationEditModalLoading;
    const inEditMode = !!education;

    return (
      <Modal
        open={open}
        onClose={closeModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.EducationEditModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.EducationEditModal_modalHeader)}>
            Add {degree === 'Postdoctoral Scientist' ? "Postdoc" : degree}
          </div>
          <div className={css(styles.EducationEditModal_modalFieldLabel)}>
            Research Institution
          </div>
          <Dropdown
            className={css(styles.EducationEditModal_dropdown)}
            fluid
            selection
            icon={null}
            placeholder={"Search research institutions"}
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
          {degree === 'PhD' && (
            <>
              <div className={css(styles.EducationEditModal_modalFieldLabel)}>
                Field of Study
              </div>
              <div>
               <input
                  className={css(styles.EducationEditModal_modalTextInput)}
                  type='text'
                  value={fieldOfStudy}
                  onChange={(e) => this.handleChange(e, 'fieldOfStudy')}
                />
              </div>
            </>
          )}
          <input
            className={css(styles.EducationEditModal_modalTextInput)}
            type="hidden"
            value={degree || ''}
          />
          <div style={{ width: '48%', marginRight: '4%', display: 'inline-block' }}>
            <div className={css(styles.EducationEditModal_modalFieldLabel)}>
              Start Year
            </div>
            <Dropdown
              className={css(styles.EducationEditModal_dropdown)}
              icon="chevron down"
              fluid
              selection
              placeholder="Start Year"
              value={startYear || ''}
              options={yearOptions}
              onChange={(e, selection) => this.handleYears(e, selection, 'startYear')}
            />
          </div>
          <div style={{ width: '48%', display: 'inline-block' }}>
            <div className={css(styles.EducationEditModal_modalFieldLabel)}>
              End Year
            </div>
            <Dropdown
              className={css(styles.EducationEditModal_dropdown)}
              icon="chevron down"
              fluid
              selection
              placeholder="End Year"
              value={endYear || ''}
              options={[{ key: 'Present', text: 'Present', value: 'Present'}].concat(yearOptions)}
              onChange={(e, selection) => this.handleYears(e, selection, 'endYear')}
            />
          </div>
          <div className={css(styles.EducationEditModal_modalButtonHolder)}>
            {inEditMode &&
              <Button
                className={css(modalStyles.Modal_deleteButton)}
                type='submit'
                onClick={this.deleteEducation}
                >
                Delete
              </Button>
            }
            <Button
              className={css(styles.EducationEditModal_modalCancelButton)}
              type='submit'
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.EducationEditModal_modalSubmitButton)}
              type='submit'
              disabled={!validEducation}
              onClick={this.handleSubmitMessage}
            >
              {isNew ? 'Add' : 'Save'}
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

EducationEditModal.propTypes = {
  education: PropTypes.object,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default EducationEditModal;
