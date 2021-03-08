import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styles from './styles'
import { styles as modalStyles } from '../Modal'
import {
  fetchPatents as fetchPatentsAction,
  togglePatentModal as togglePatentModalAction,
} from '../../actions/profileActions';
import {
  authenticityToken,
} from '../../utils/requests';


const yearOptions = _.range(new Date().getFullYear(), 1950, -1).map((year) => {
  return {
    key: year,
    text: year,
    value: String(year),
  };
});

moment.locale('en');
const monthOptions = moment.monthsShort('-MMM-').map((month, index) => {
  return {
    key: month,
    text: month,
    value: String(index + 1),
  };
});

const dayOptions = (month = 12, year = 2019) => {
  const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()
  return _.range(1, daysInMonth + 1).map((day, index) => {
    return {
      key: day,
      text: day,
      value: String(day),
    };
  })
};

const defaultState = {
  patentModalLoading: false,
  patentTitle: '',
  patentUrl: '',
  patentAbstract: '',
  patentStatus: null,
  patentFilingMonth: null,
  patentFilingYear: null,
  patentFilingDay: null,
};

class NewPatentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.patentModalOpen) return;
    // skip updating state if modal already open

    const {
      currentPatentId,
      patents,
      inEditMode,
      patentModalOpen
    } = this.props;

    if(inEditMode) {
      // when OPENING modal to edit patent
      const patent = _.find(patents, ['id', currentPatentId])
      const date = moment.utc(patent.filing_date);

      this.setState({
        patentTitle: patent.title,
        patentUrl: patent.url,
        patentAbstract: patent.abstract,
        patentStatus: patent.status,
        patentFilingMonth: date.format('M'),
        patentFilingYear: date.format('YYYY'),
        patentFilingDay: date.format('D')
      });
    } else if (!inEditMode) {
      // when creating new patent
      this.setState(defaultState);
    }
  }

  handleSubmitPatent = async (e) => {
    const {
      fetchPatents,
      currentUserId,
      currentPatentId,
      togglePatentModal,
      inEditMode
    } = this.props;

    e.preventDefault();

    const {
      patentTitle,
      patentStatus,
      patentUrl,
      patentAbstract,
      patentFilingMonth,
      patentFilingYear,
      patentFilingDay,
    } = this.state;

    this.setState({
      patentModalLoading: true,
    });

    const patentFilingDate = `${patentFilingYear}-${patentFilingMonth}-${patentFilingDay}`;
    const url = (inEditMode ? `/patents/${currentPatentId}` : '/patents')

    const formData = new FormData();
    formData.append('patent[patentTitle]', patentTitle);
    formData.append('patent[patentStatus]', patentStatus);
    formData.append('patent[patentUrl]', patentUrl);
    formData.append('patent[patentAbstract]', patentAbstract);
    formData.append('patent[patentFilingDate]', patentFilingDate);

    try {
      const patentResponse = await fetch(url, {
        method: (inEditMode ? 'PATCH' : 'POST'),
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await patentResponse.json();
      if (!responseJson.success) {
        this.setState({
          patentModalLoading: false,
        });
      } else {
        await fetchPatents(currentUserId);

        this.setState({
          patentTitle: '',
          patentUrl: '',
          patentAbstract: '',
          patentModalLoading: false,
          patentFilingMonth: undefined,
          patentFilingYear: undefined,
        });
        togglePatentModal({ open: false });
      }
    } catch(err) {
      this.setState({ patentModalLoading: false });
    }
  }

  handleDeletePatent = async () => {
    if (confirm("Are you sure you want to delete that?")) {
      await fetch(`/patents/${this.props.currentPatentId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      window.location.reload();
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  handleDropdownChange = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  getDayOptions = (month, year) => {
    return dayOptions(month, year);
  }

  renderPatentStatusField = () => {
    return (
      <div>
        <div className={css(styles.NewPatentModal_modalFieldLabel)}>Status</div>
        <Dropdown
          className={css(styles.NewPatentModal_statusDropdown)}
          icon='chevron down'
          fluid
          selection
          value={this.state.patentStatus}
          options={gon.patent_statuses}
          onChange={(e, selection) => this.handleDropdownChange(e, selection, 'patentStatus')}
        />
      </div>
    )
  }

  render() {
    const {
      title,
      patentModalOpen,
      togglePatentModal,
      inEditMode
    } = this.props;

    const {
      patentModalLoading,
      patentTitle,
      patentStatus,
      patentUrl,
      patentAbstract,
      patentFilingMonth,
      patentFilingYear,
      patentFilingDay,
    } = this.state;

    const validPatent = (
      patentTitle &&
      patentUrl &&
      patentAbstract &&
      patentFilingYear &&
      patentFilingMonth &&
      patentFilingDay &&
      patentStatus
    );

    return (
      <Modal
        open={patentModalOpen}
        onClose={() => togglePatentModal({ open: false })}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.NewPatentModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.NewPatentModal_modalHeader)}>{inEditMode ? 'Update Patent' : 'Add Patent'}</div>

          {this.renderPatentStatusField()}

          <div className={css(styles.NewPatentModal_modalFieldLabel)}>
            Title
          </div>
          <div>
            <input
              className={css(styles.NewPatentModal_modalInput)}
              placeholder='e.g. Inducible DNA binding proteins and genome perturbation tools'
              type='text'
              value={patentTitle}
              onChange={(e) => this.handleChange(e, 'patentTitle')}
            />
          </div>
          <div className={css(styles.NewPatentModal_modalFieldLabel)}>
            URL
          </div>
          <div>
            <input
              className={css(styles.NewPatentModal_modalInput)}
              placeholder='e.g. https://patents.google.com/patent/US20170166903A1'
              type='text'
              value={patentUrl}
              onChange={(e) => this.handleChange(e, 'patentUrl')}
            />
          </div>
          <div className={css(styles.NewPatentModal_modalFieldLabel)}>
            Abstract
          </div>
          <div>
            <textarea
              className={css(styles.NewPatentModal_modalTextArea)}
              rows="4"
              value={patentAbstract}
              onChange={(e) => this.handleChange(e, 'patentAbstract')}
            />
          </div>
          <div className={css(styles.NewPatentModal_modalFieldLabel)}>
            Date Filed
          </div>
          <div className={css(styles.NewPatentModal_dateField)}>
            <Dropdown
              className={css(styles.NewPatentModal_dateDropdown)}
              icon='chevron down'
              fluid
              selection
              placeholder="Month"
              value={patentFilingMonth || ''}
              options={monthOptions}
              onChange={(e, selection) => this.handleDropdownChange(e, selection, 'patentFilingMonth')}
            />
            <Dropdown
              className={css(styles.NewPatentModal_dateDropdown)}
              icon='chevron down'
              disabled={!patentFilingMonth}
              fluid
              selection
              placeholder="Day"
              value={patentFilingDay || ''}
              options={this.getDayOptions(patentFilingMonth, patentFilingYear)}
              onChange={(e, selection) => this.handleDropdownChange(e, selection, 'patentFilingDay')}
            />
            <Dropdown
              className={css(styles.NewPatentModal_dateDropdown)}
              icon='chevron down'
              fluid
              placeholder="Year"
              selection
              value={patentFilingYear || ''}
              options={yearOptions}
              onChange={(e, selection) => this.handleDropdownChange(e, selection, 'patentFilingYear')}
            />
          </div>
          <div className={css(styles.NewPatentModal_modalButtonHolder)}>
            {inEditMode &&
              <Button
                className={css(modalStyles.Modal_deleteButton)}
                type='submit'
                disabled={patentModalLoading}
                onClick={this.handleDeletePatent}
                >
                Delete
              </Button>
            }

            <Button
              className={css(styles.NewPatentModal_modalCancelButton)}
              type='submit'
              onClick={() => togglePatentModal({ open: false })}
            >
              Cancel
            </Button>

            <Button
              className={css(styles.NewPatentModal_modalSubmitButton)}
              type='submit'
              disabled={patentModalLoading || !validPatent}
              onClick={this.handleSubmitPatent}
            >
              {inEditMode ? 'Update' : 'Submit'}
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

NewPatentModal.propTypes = {
  title: PropTypes.string,
  fetchPatents: PropTypes.func,
  togglePatentModal: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    patentModalOpen: state.profiles.patentModalOpen,
    currentPatentId: state.profiles.currentPatentId,
    inEditMode: !!state.profiles.currentPatentId,
    patents: state.profiles.patents
  };
};

const mapDispatchToProps = {
  fetchPatents: fetchPatentsAction,
  togglePatentModal: togglePatentModalAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewPatentModal);
