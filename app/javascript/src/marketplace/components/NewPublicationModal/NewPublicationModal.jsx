import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { styles as modalStyles } from '../Modal'
import { COLORS } from '../../../../constants';
import {
  fetchPublications as fetchPublicationsAction,
  togglePublicationModal as togglePublicationModalAction,
} from '../../actions/profileActions';
import {
  authenticityToken,
} from '../../utils/requests';


const styles = StyleSheet.create({
  NewPublicationModal_modal: {
    overflow: 'visible',
  },
  NewPublicationModal_dateDropdown: {
    width: '48%',
    height: '48px',
    fontSize: '14px',
    display: 'inline-block',
    alignItems: 'center',
    borderRadius: '0px',
    paddingTop: '16px',
    color: COLORS.defaultText,
    border: `1px solid ${COLORS.defaultText}`,
  },
  NewPublicationModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  NewPublicationModal_modalInput: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    height: '50px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  NewPublicationModal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  NewPublicationModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  NewPublicationModal_datepicker: {
    width: '100%',
    height: '50px',
    padding: '10px',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '14px',
  },
  NewPublicationModal_modalSubmitButton: {
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
  NewPublicationModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  NewPublicationModal_modalCancelButton: {
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
});

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

class NewPublicationModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      publicationModalLoading: false,
      publicationTitle: props.publicationTitle,
      publicationName: props.publicationName,
      publicationAbstract: props.publicationAbstract,
      publicationURL: props.publicationURL,
      publicationMonth: props.publicationMonth,
      publicationYear: props.publicationYear,
      importingPublication: false,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      currentPublicationId,
      currentUserId,
      publications,
      inEditMode,
      publicationModalOpen
    } = this.props;

    if(inEditMode){
      // when OPENING modal to edit publication

      if (prevProps.publicationModalOpen) return;
      // skip updating state if modal already open

      const publication = _.find(publications, ['id', currentPublicationId])
      const date = moment.utc(publication.date);

      this.setState({
        publicationTitle: publication.title,
        publicationName: publication.publication_name,
        publicationAbstract: publication.abstract,
        publicationURL: publication.url,
        publicationMonth: date.format('M'),
        publicationYear: date.format('YYYY'),
      });
    } else {
      // when creating new publication
      if (prevProps.publicationTitle !== this.props.publicationTitle) {
        this.setState({
          publicationTitle: this.props.publicationTitle,
          publicationName: this.props.publicationName,
          publicationAbstract: this.props.publicationAbstract,
          publicationURL: this.props.publicationURL,
        });
      }
      if (prevProps.publicationYear !== this.props.publicationYear) {
        this.setState({
          publicationYear: this.props.publicationYear,
          publicationMonth: this.props.publicationMonth,
        });
      }
    }
  }

  handleSubmitPublication = async (e) => {
    const {
      fetchPublications,
      togglePublicationModal,
      currentUserId,
      currentPublicationId,
      clearUrl,
      afterAddAction,
      inEditMode
    } = this.props;

    e.preventDefault();

    const {
      publicationTitle,
      publicationName,
      publicationAbstract,
      publicationMonth,
      publicationYear,
      publicationURL,
    } = this.state;

    this.setState({
      publicationModalLoading: true,
    });

    const formData = new FormData();
    formData.append('publication[publicationTitle]', publicationTitle);
    formData.append('publication[publicationName]', publicationName);
    formData.append('publication[publicationAbstract]', publicationAbstract);
    formData.append('publication[publicationURL]', encodeURI(publicationURL));

    if (publicationYear) {
      const publicationDate = `${publicationYear}-${publicationMonth || 1}-15`;
      formData.append('publication[publicationDate]', publicationDate);
    }

    const url = (inEditMode ? `/publications/${currentPublicationId}` : '/publications')

    try {
      const publicationResponse = await fetch(url, {
        method: (inEditMode ? 'PATCH' : 'POST'),
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await publicationResponse.json();
      if (!responseJson.success) {
        this.setState({
          publicationModalLoading: false,
        });
      } else {
        await fetchPublications(currentUserId);
        this.setState({
          publicationModalLoading: false,
          publicationTitle: '',
          publicationName: '',
          publicationAbstract: '',
          publicationURL: '',
          publicationMonth: undefined,
          publicationYear: undefined,
        });
        clearUrl();
        afterAddAction(responseJson.publication.id);
        togglePublicationModal(false);
      }
    } catch(err) {
      this.setState({ publicationModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  handleTime = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  handleDeletePublication = async () => {
    if (confirm("Are you sure you want to delete that?")) {
      await fetch(`/publications/${this.props.currentPublicationId}`, {
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
      title,
      publicationModalOpen,
      togglePublicationModal,
      clearUrl,
      inEditMode
    } = this.props;

    const {
      publicationModalLoading,
      publicationTitle,
      publicationName,
      publicationAbstract,
      publicationMonth,
      publicationYear,
      publicationURL,
      importingPublication,
    } = this.state;

    const validPublication = publicationTitle && publicationName && publicationAbstract;
    return (
      <Modal
        open={publicationModalOpen}
        onClose={() => {
          clearUrl();
          togglePublicationModal(false);
        }}
        size="small"
        closeOnDimmerClick={false}
        className={css(styles.NewPublicationModal_modal)}
      >
        <Modal.Content>
          <div className={css(styles.NewPublicationModal_modalHeader)}>{title}</div>
          <div className={css(styles.NewPublicationModal_modalFieldLabel)}>
            Journal
          </div>
          <div>
            <input
              className={css(styles.NewPublicationModal_modalInput)}
              placeholder='e.g. Science, American Journal of Kidney Diseases, Journal of Neuroscience'
              value={publicationName}
              type='text'
              onChange={(e) => this.handleChange(e, 'publicationName')}
            />
          </div>
          <div className={css(styles.NewPublicationModal_modalFieldLabel)}>
            Publication Title
          </div>
          <div>
            <input
              className={css(styles.NewPublicationModal_modalInput)}
              placeholder='e.g. Cardiovascular risk in children and adolescents with end stage renal disease'
              value={publicationTitle}
              type='text'
              onChange={(e) => this.handleChange(e, 'publicationTitle')}
            />
          </div>
          {publicationURL &&
            <>
              <div className={css(styles.NewPublicationModal_modalFieldLabel)}>
                Publication URL
              </div>
              <div>
                <input
                  className={css(styles.NewPublicationModal_modalInput)}
                  value={publicationURL}
                  type='text'
                  disabled={true}
                />
              </div>
            </>}
          <div className={css(styles.NewPublicationModal_modalFieldLabel)}>
            Abstract
          </div>
          <div>
            <textarea
              className={css(styles.NewPublicationModal_modalTextArea)}
              rows="4"
              value={publicationAbstract}
              onChange={(e) => this.handleChange(e, 'publicationAbstract')}
            />
          </div>
          <div className={css(styles.NewPublicationModal_modalFieldLabel)}>
            Date
          </div>
          <div>
            <Dropdown
              className={css(styles.NewPublicationModal_dateDropdown)}
              icon='chevron down'
              fluid
              selection
              placeholder="Month"
              style={{ marginRight: '4%' }}
              value={publicationMonth || ''}
              options={monthOptions}
              onChange={(e, selection) => this.handleTime(e, selection, 'publicationMonth')}
            />
            <Dropdown
              className={css(styles.NewPublicationModal_dateDropdown)}
              icon='chevron down'
              fluid
              placeholder="Year"
              selection
              value={publicationYear || ''}
              options={yearOptions}
              onChange={(e, selection) => this.handleTime(e, selection, 'publicationYear')}
            />
          </div>
          <div className={css(styles.NewPublicationModal_modalButtonHolder)}>
            {inEditMode &&
              <Button
                className={css(modalStyles.Modal_deleteButton)}
                type='submit'
                disabled={publicationModalLoading}
                onClick={this.handleDeletePublication}
                >
                Delete
              </Button>
            }
            <Button
              className={css(styles.NewPublicationModal_modalCancelButton)}
              type='submit'
              onClick={() => {
                clearUrl();
                togglePublicationModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.NewPublicationModal_modalSubmitButton)}
              type='submit'
              disabled={publicationModalLoading || !validPublication}
              onClick={this.handleSubmitPublication}
            >
              Submit
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

NewPublicationModal.propTypes = {
  title: PropTypes.string,
  fetchPublications: PropTypes.func,
  togglePublicationModal: PropTypes.func,
  afterAddAction: PropTypes.func,
};

NewPublicationModal.defaultProps = {
  afterAddAction: () => {},
};

const mapStateToProps = (state) => {
  return {
    publicationModalOpen: state.profiles.publicationModalOpen,
    currentPublicationId: state.profiles.currentPublicationId,
    inEditMode: !!state.profiles.currentPublicationId,
    publications: state.profiles.publications,
    currentPublicationId: state.profiles.currentPublicationId,
    inEditMode: !!state.profiles.currentPublicationId
  };
};

const mapDispatchToProps = {
  fetchPublications: fetchPublicationsAction,
  togglePublicationModal: togglePublicationModalAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewPublicationModal);
