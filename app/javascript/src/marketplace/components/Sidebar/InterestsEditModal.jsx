import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Button, Dropdown, Icon } from 'semantic-ui-react';
import _, { debounce } from 'lodash';
import classnames from "classnames";

import { COLORS } from '../../../../constants';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  InterestsEditModal_modal: {
    overflow: 'visible',
  },
  InterestsEditModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  InterestsEditModal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  InterestsEditModal_modalSubmitButton: {
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
  InterestsEditModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  InterestsEditModal_modalCancelButton: {
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
  InterestsEditModal_dropdown: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: COLORS.gray,
    margin: 'auto',
    fontSize: '14px',
  },
  InterestsEditModal_searchDropdown: {
    fontSize: '14px',
    minHeight: '48px',
    paddingTop: '8px',
  },
  InterestsEditModal_searchIcon: {
    width: '10%',
    height: '48px',
    paddingTop: '8px',
    fontSize: '24px',
    color: COLORS.lightGray,
    backgroundColor: COLORS.transparentDarkGray,
    justifyContent: 'center',
    display: 'flex',
  },
  InterestsEditModal_searchContainer: {
    display: 'flex',
  },
});

class InterestsEditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      interestsEditModalLoading: false,
      keywords: props.currentUser.keywords,
      searchQuery: '',
      loadingSearch: false,
      keywordSearchOptions: props.currentUser.keywords && props.currentUser.keywords.length > 0 ? _.uniqBy(props.currentUser.keywords.map((keyword) => {
        return {
          key: keyword,
          text: keyword,
          value: keyword,
        };
      }), 'key') : [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setState({
        keywords: this.props.currentUser.keywords,
        keywordSearchOptions: this.props.currentUser.keywords && this.props.currentUser.keywords.length > 0 ? _.uniqBy(this.props.currentUser.keywords.map((keyword) => {
          return {
            key: keyword,
            text: keyword,
            value: keyword,
          };
        }), 'key') : [],
      });
    }
  }

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
    const {
      keywords,
      keywordSearchOptions,
    } = this.state;
    const searchOptions = _.uniqBy(keywordSearchOptions.concat(keywords.map((keyword) => {
      return {
        key: keyword,
        text: keyword,
        value: keyword,
      };
    })), 'key');
    return searchOptions;
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

  handleSubmitMessage = async (e) => {
    const {
      closeModal,
      currentUser,
    } = this.props;

    e.preventDefault();

    const {
      keywords,
    } = this.state;

    this.setState({
      interestsEditModalLoading: true,
    });

    const formData = new FormData();
    formData.append('keywords', keywords);
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
          interestsEditModalLoading: false,
        });
      } else {
        this.setState({
          interestsEditModalLoading: false,
        });
        window.location.reload();
      }
    } catch(err) {
      this.setState({ interestsEditModalLoading: false });
    }
  }

  render() {
    const {
      open,
      proposal,
      closeModal,
    } = this.props;

    const {
      keywords,
      interestsEditModalLoading,
      searchQuery,
      loadingSearch,
      keywordSearchOptions,
    } = this.state;

    const validKeywords = keywords && keywords.length > 0 && !loadingSearch && !interestsEditModalLoading;
    return (
      <Modal
        open={open}
        onClose={closeModal}
        size="small"
        closeOnDimmerClick={false}
        className={`${css(styles.InterestsEditModal_modal)} scrolling`}
      >
        <Modal.Content>
          <div className={css(styles.InterestsEditModal_modalFieldLabel)}>
            Interests
          </div>
          <div className={classnames(css(styles.InterestsEditModal_searchContainer), "onboarding-dropdown")}>
            <Dropdown
              className={css(styles.InterestsEditModal_searchDropdown)}
              placeholder='Search for keywords'
              fluid
              selection
              multiple
              icon='search'
              search={this.handleSearchQuery}
              value={keywords}
              open={searchQuery.length > 0 && this.state.keywordSearchOpen}
              onBlur={() => this.setState({ keywordSearchOpen: false })}
              onFocus={() => this.setState({ keywordSearchOpen: true })}
              searchQuery={searchQuery}
              options={keywordSearchOptions}
              onChange={this.handleKeywords}
              onSearchChange={this.handleSearchChange}
              loading={loadingSearch}
            />
          </div>
          <div className={css(styles.InterestsEditModal_modalButtonHolder)}>
            <Button
              className={css(styles.InterestsEditModal_modalCancelButton)}
              type='submit'
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.InterestsEditModal_modalSubmitButton)}
              type='submit'
              disabled={!validKeywords}
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

InterestsEditModal.propTypes = {
  currentUser: PropTypes.object,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default InterestsEditModal;
