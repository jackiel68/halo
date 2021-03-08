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
  StartupEditModal_modal: {
    overflow: 'visible',
  },
  StartupEditModal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  StartupEditModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  StartupEditModal_modalTextInput: {
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
  StartupEditModal_modalSubmitButton: {
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
  StartupEditModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  StartupEditModal_modalCancelButton: {
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
  StartupEditModal_dropdown: {
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

class StartupEditModal extends PureComponent {
  constructor(props) {
    super(props);

    const startup = props.startup || {};
    this.state = {
      isNew: _.isEmpty(startup),
      startupEditModalLoading: false,
      startupName: startup.startup_name,
      startupUrl: startup.url,
      startYear: startup.start_year,
      endYear: startup.end_year,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.startup !== this.props.startup) {
      const startup = this.props.startup || {};
      this.setState({
        isNew: _.isEmpty(startup),
        startupName: startup.startup_name,
        startupUrl: startup.url,
        startYear: startup.start_year,
        endYear: startup.end_year,
      });
    }
  }

  handleSubmitMessage = async (e) => {
    const {
      closeModal,
    } = this.props;

    e.preventDefault();

    const {
      startupName,
      startupUrl,
      startYear,
      endYear,
      isNew,
    } = this.state;

    this.setState({
      startupEditModalLoading: true,
    });

    const startup = this.props.startup || {};

    const formData = new FormData();
    formData.append('startup_name', startupName);
    if (startupUrl) {
      formData.append('url', startupUrl);
    }
    if (startYear) {
      formData.append('start_year', startYear);
    }
    if (endYear) {
      formData.append('end_year', endYear);
    }

    try {
      const startupResponse = await fetch(
        isNew ? '/startups' : `/startups/${startup.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'X-CSRF-Token': authenticityToken(),
          }
        }
      );
      const responseJson = await startupResponse.json();
      if (!responseJson.success) {
        this.setState({
          startupEditModalLoading: false,
        });
      } else {
        this.setState({
          startupEditModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ startupEditModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  handleYears = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  handleDelete = async () => {
     if (confirm("Are you sure you want to delete that?")) {
      await fetch(`/startups/${this.props.startup.id}`, {
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
      startup,
      closeModal,
    } = this.props;

    const {
      isNew,
      startupEditModalLoading,
      startupName,
      startupUrl,
      startYear,
      endYear,
    } = this.state;

    const validStartup = !!startupName;
    return (
      <Modal
        open={open}
        onClose={closeModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.StartupEditModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.StartupEditModal_modalHeader)}>
            Add Startup
          </div>
          <div className={css(styles.StartupEditModal_modalFieldLabel)}>
            Startup Name
          </div>
          <div>
           <input
              className={css(styles.StartupEditModal_modalTextInput)}
              type='text'
              value={startupName}
              onChange={(e) => this.handleChange(e, 'startupName')}
            />
          </div>
          <div className={css(styles.StartupEditModal_modalFieldLabel)}>
            URL
          </div>
          <div>
           <input
              className={css(styles.StartupEditModal_modalTextInput)}
              type='text'
              value={startupUrl}
              onChange={(e) => this.handleChange(e, 'startupUrl')}
            />
          </div>
          <div style={{ width: '48%', marginRight: '4%', display: 'inline-block' }}>
            <div className={css(styles.StartupEditModal_modalFieldLabel)}>
              Start Year
            </div>
            <Dropdown
              className={css(styles.StartupEditModal_dropdown)}
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
            <div className={css(styles.StartupEditModal_modalFieldLabel)}>
              End Year
            </div>
            <Dropdown
              className={css(styles.StartupEditModal_dropdown)}
              icon="chevron down"
              fluid
              selection
              placeholder="End Year"
              value={endYear || ''}
              options={[{ key: 'Present', text: 'Present', value: 'Present'}].concat(yearOptions)}
              onChange={(e, selection) => this.handleYears(e, selection, 'endYear')}
            />
          </div>
          <div className={css(styles.StartupEditModal_modalButtonHolder)}>
            {!_.isEmpty(startup) &&
              <Button
                className={css(modalStyles.Modal_deleteButton)}
                type='submit'
                onClick={this.handleDelete}
                >
                Delete
              </Button>
            }
            <Button
              className={css(styles.StartupEditModal_modalCancelButton)}
              type='submit'
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.StartupEditModal_modalSubmitButton)}
              type='submit'
              disabled={!validStartup}
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

StartupEditModal.propTypes = {
  startup: PropTypes.object,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default StartupEditModal;
