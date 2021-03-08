import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Modal, Dropdown, Button, Checkbox, Form, Radio, Icon } from 'semantic-ui-react';
import _, { debounce } from 'lodash';
import CurrencyInput from 'react-currency-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { COLORS } from '../../../../constants';
import {
  fetchFundings as fetchFundingsAction,
  toggleFundingModal as toggleFundingModalAction,
} from '../../actions/profileActions';
import {
  fetchCompanies as fetchCompaniesAction,
  fetchFoundations as fetchFoundationsAction,
  fetchGovernmentOrganizations as fetchGovernmentOrganizationsAction
} from '../../actions/defaultActions';
import {
  authenticityToken,
} from '../../utils/requests';
import { styles as modalStyles } from '../Modal'

const styles = StyleSheet.create({
  NewFundingModal_modal: {
    overflow: 'visible',
  },
  NewFundingModal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.inputLabelGray
  },
  NewFundingModal_modalInput: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    height: '50px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  NewFundingModal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
  },
  NewFundingModal_modalSubheader: {
    fontSize: '14px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  NewFundingModal_datepicker: {
    width: '100%',
    height: '50px',
    padding: '10px',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '14px',
  },
  NewFundingModal_modalSubmitButton: {
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
  NewFundingModal_dropdown: {
    width: '100%',
    height: '48px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0px',
    color: COLORS.defaultText,
    border: `1px solid ${COLORS.defaultText}`,
  },
  NewFundingModal_dateDropdown: {
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
  NewFundingModal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '36px',
  },
  NewFundingModal_modalCancelButton: {
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
  NewFundingModal_textarea: {
    height: '100px'
  },
  NewFundingModal_activeCheckboxLabel: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.gray,
    margin: '10px 6px'
  },
  NewFundingModal_activeCheckboxWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '6px'
  },
  NewFundingModal_moneyInput: {
    width: '48%'
  },
  NewFundingModal_radioFormField: {
    paddingRight: '7px',
    display: 'inline',
    fontSize: '12px',
    fontWeight: 500,
    ':nth-child(1n) input~label:before': {
      borderWidth: '2px'
    },
    ':nth-child(1n) input:checked~label:before': {
      borderColor: COLORS.blue,
      borderWidth: '2px'
    },
    ':nth-child(1n) input:checked~label:after': {
      backgroundColor: COLORS.blue,
    },
  },
  NewFundingModal_radioInputForm: {
    display: 'inline-block',
    marginTop: '10px'
  },
  NewFundingModal_radioInputFormLabel: {
    color: COLORS.inputLabelGray,
    width: 'unset',
    marginRight: '10px'
  },
  NewFundingModal_radioInput: {
    ':nth-child(1n) label': {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: COLORS.inputLabelGray
    }
  }
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

const nihOptions = gon.nih_grant_types.map((nihType) => {
  return {
    key: nihType,
    text: nihType,
    value: nihType,
  };
});

const fundingSourceFieldLabels = {
  government: "Agencies",
  university: "Universities",
  foundation: "Foundations",
  company: "Industries"
}

const defaultState = {
  fundingModalLoading: false,
  fundingTitle: '',
  fundingDescription: '',
  fundingAmount: undefined,
  fundingActive: true,
  fundingSponsor: {},
  searchQuery: '',
  location: '',
  loadingSearch: false,
  loadingUniversitySearch: false,
  fundingMonth: undefined,
  fundingYear: undefined,
  fundingEndMonth: null,
  fundingEndYear: null,
  fundingURL: '',
  fundingSourceType: '',
  fundingGrantType: '',
  universitySearchQuery: '',
  otherSponsor: '',
  isAwardRecipient: true
};

class NewFundingModal extends PureComponent {
  companyOptions = [{ key: 'other_sponsor', text: 'Other', value: 'Other' }];
  foundationOptions = [{ key: 'other_sponsor', text: 'Other', value: 'Other' }];
  governmentOrganizationOptions = [{ key: 'other_sponsor', text: 'Other', value: 'Other' }];
  universityOptions = [{ key: 'other_sponsor', text: 'Other', value: 'Other' }];

  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.fundingModalOpen) return;
    // skip updating state if modal already open

    const {
      currentFundingId,
      currentUserId,
      fundings,
      inEditMode,
      fundingModalOpen
    } = this.props;

    if(inEditMode) {
      // when OPENING modal to edit funding
      const funding = _.find(fundings, ['id', currentFundingId])
      const startDate = moment.utc(funding.date);
      const endDate = moment.utc(funding.end_date);
      const sponsorNameKey = _.keys(funding.sponsor).filter((key) => key.match('name'));
      const fundingSponsor = funding.other_sponsor ?
                              { key: 'other_sponsor', text: 'Other', value: 'Other' } :
                              { key: funding.sponsor.id, value: funding.sponsor.id, text: funding.sponsor[sponsorNameKey] };

      this.setState({
        fundingTitle: funding.title,
        fundingDescription: funding.description,
        fundingAmount: funding.amount,
        fundingActive: !funding.end_date,
        fundingURL: funding.url,
        fundingSponsor,
        fundingMonth: funding.abstract,
        fundingStatus: funding.status,
        fundingMonth: startDate.format('M'),
        fundingYear: startDate.format('YYYY'),
        fundingEndMonth: endDate.format('M'),
        fundingEndYear: endDate.format('YYYY'),
        fundingSourceType: funding.sponsor_type,
        fundingGrantType: funding.grant_type,
        otherSponsor: funding.other_sponsor,
        isAwardRecipient: funding.award_recipient_id === currentUserId
      });
    } else if (!inEditMode) {
      // when creating new patent
      this.setState(defaultState);
    }
  }

  async componentWillMount() {
    const {
      fetchCompanies,
      fetchFoundations,
      fetchGovernmentOrganizations
    } = this.props;


    const companies = await fetchCompanies();
    this.companyOptions = companies.map(company => {
      return {
        key: company.id,
        text: company.company_name,
        value: company.id,
      };
    }).concat({ key: 'other_sponsor', text: 'Other', value: 'Other'});


    const foundations = await fetchFoundations();
    this.foundationOptions = foundations.map(foundation => {
      return {
        key: foundation.id,
        text: foundation.foundation_name,
        value: foundation.id,
      };
    }).concat({ key: 'other_sponsor', text: 'Other', value: 'Other'});


    const governmentOrganizations = await fetchGovernmentOrganizations();
    this.governmentOrganizationOptions = governmentOrganizations.map(org => {
      return {
        key: org.id,
        text: org.org_name,
        value: org.id,
      };
    }).concat({ key: 'other_sponsor', text: 'Other', value: 'Other'});
  }

  closeModal = () => {
    this.setState(defaultState);
    this.props.toggleFundingModal(false);
  }

  handleSubmitFunding = async (e) => {
    const {
      fetchFundings,
      currentUserId,
      currentFundingId,
      inEditMode
    } = this.props;

    e.preventDefault();

    const {
      fundingTitle,
      fundingDescription,
      fundingAmount,
      fundingSponsor,
      fundingMonth,
      fundingYear,
      fundingEndMonth,
      fundingEndYear,
      fundingActive,
      fundingURL,
      fundingSourceType,
      fundingGrantType,
      otherSponsor,
      isAwardRecipient
    } = this.state;

    this.setState({
      fundingModalLoading: true,
    });

    const formData = new FormData();
    formData.append('funding[fundingTitle]', fundingTitle);
    formData.append('funding[fundingDescription]', fundingDescription);
    formData.append('funding[fundingAmount]', fundingAmount);
    formData.append('funding[fundingSourceType]', fundingSourceType);
    formData.append('funding[isAwardRecipient]', isAwardRecipient);

    if (fundingSponsor) {
      if(fundingSponsor.key === 'other_sponsor'){
        formData.append('funding[hasOtherSponsor]', true);
        formData.append('funding[fundingSponsor]', otherSponsor);
      } else {
        formData.append('funding[fundingSponsor]', fundingSponsor.key);
      }
    }

    if (fundingYear) {
      const fundingDate = `${fundingYear}-${fundingMonth || 1}-15`;
      formData.append('funding[fundingDate]', fundingDate);
    }
    if (fundingEndMonth && fundingEndYear && !fundingActive) {
      const fundingEndDate = `${fundingEndYear}-${fundingEndMonth || 1}-15`;
      formData.append('funding[fundingEndDate]', fundingEndDate);
    }
    if (fundingURL) {
      formData.append('funding[fundingURL]', fundingURL);
    }
    if (fundingGrantType) {
      formData.append('funding[fundingGrantType]', fundingGrantType);
    }

    const url = (inEditMode ? `/fundings/${currentFundingId}` : '/fundings')

    try {
      const fundingResponse = await fetch(url, {
        method: (inEditMode ? 'PATCH' : 'POST'),
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await fundingResponse.json();
      if (!responseJson.success) {
        this.setState({
          fundingModalLoading: false,
        });
      } else {
        await fetchFundings(currentUserId);
        this.setState({
          fundingTitle: '',
          fundingDescription: '',
          fundingAmount: '',
          fundingSponsor: '',
          searchQuery: '',
          fundingSourceType: '',
          fundingURL: '',
          fundingGrantType: '',
          fundingModalLoading: false,
        });
        this.closeModal();
      }
    } catch(err) {
      this.setState({ fundingModalLoading: false });
    }
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  handleCurrencyAmount = (e, maskedValue, floatValue) => {
    this.setState({ fundingAmount: floatValue })
  }

  handleSearchQuery = (options, query) => {
    this.setState({ loadingSearch: true });
    let filteredOptions;
    if (query.length >= 1) {
      const re = new RegExp(_.escapeRegExp(query), "i");
      filteredOptions = options.filter(opt => re.test(opt.text));
      this.setState({ loadingSearch: false });
      return _.uniqBy(filteredOptions.concat({ key: 'other_sponsor', text: 'Other', value: 'Other'}), 'value');
    }
    this.setState({ loadingSearch: false });
  }

  handleSearchChange = (e, { searchQuery }) => {
    this.setState({ searchQuery });
  };

  handleTime = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  handleUniversityInputChange = (e, selection) => {
    this.setState({
      universitySearchQuery: selection.value,
      location: selection.value,
      fundingSponsor: _.find(this.universityOptions, (option) => option.value === selection.value)
    });
  };

  handleUniversitySearchQuery = (options, query) => {
    const { location } = this.state;

    return _.uniqBy([{ key: location, text: location, value: location }].concat(this.universityOptions), 'value')
            .filter(university => university.value.length > 0);
  }

  universitySearch = debounce(async (name) => {
    this.setState({ loadingUniversitySearch: true });
    const response = await fetch(`/universities/search?name=${name}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const responseJson = await response.json();
    const universities = responseJson.universities;

    this.universityOptions = universities.concat({ key: 'other_sponsor', text: 'Other', value: 'Other'});

    this.setState({
      location: '',
      loadingUniversitySearch: false,
    });
  }, 500, { leading: true, trailing: true });

  handleUniversitySearchChange = async (e, { searchQuery }) => {
    this.universitySearch(searchQuery);

    this.setState({
      universitySearchQuery: searchQuery,
    });
  };

  handleSearch = (options, query) => {
    const re = new RegExp(_.escapeRegExp(query, 'i'))
    return options.filter((opt) => {
      return re.test(opt.text) || opt.text === 'Other'
    })
  }

  handleDeleteFunding = async () => {
    if (confirm("Are you sure you want to delete that?")) {
      await fetch(`/fundings/${this.props.currentFundingId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      window.location.reload();
    }
  }

  renderFundingSourceSelector = () => {
    const {
      fundingSponsor,
      searchQuery,
      fundingSourceType,
      universitySearchQuery,
      fundingGrantType,
      loadingUniversitySearch,
      location,
      otherSponsor
    } = this.state;

    let dropdownOptions;
    if (searchQuery.length >= 1) {
      dropdownOptions = this.companyOptions;
    } else {
      dropdownOptions = fundingSponsor.key ? [fundingSponsor] : [];
    }

    return (
      <>
        <div className={css(styles.NewFundingModal_modalFieldLabel)}>
          {fundingSourceFieldLabels[fundingSourceType]}
        </div>

        {fundingSourceType === 'company' &&
          <div className='custom-dropdown'>
            <Dropdown
              className={css(styles.NewFundingModal_dropdown)}
              placeholder='Search industries...'
              icon={null}
              fluid
              selection
              open={searchQuery.length > 0 && this.state.keywordSearchOpen}
              onBlur={() => this.setState({ keywordSearchOpen: false })}
              onFocus={() => this.setState({ keywordSearchOpen: true })}
              search={this.handleSearchQuery}
              searchQuery={searchQuery}
              value={fundingSponsor.value || fundingSponsor.company_name}
              options={dropdownOptions}
              onSearchChange={this.handleSearchChange}
              onChange={(e, selection) => {
                this.setState({
                  searchQuery: '',
                  hasSubmitted: false,
                  fundingSponsor: _.find(this.companyOptions, (option) => option.value === selection.value),
                });
              }}
            />
          </div>}
        {fundingSourceType === 'foundation' &&
          <div>
            <Dropdown
              className={css(styles.NewFundingModal_dropdown)}
              placeholder='Search foundations...'
              icon={null}
              fluid
              selection
              search={this.handleSearch}
              value={fundingSponsor.value || fundingSponsor.foundation_name}
              options={this.foundationOptions}
              onChange={(e, selection) => {
                this.setState({
                  fundingSponsor: _.find(this.foundationOptions, (option) => option.value === selection.value),
                });
              }}
            />
          </div>}
        {fundingSourceType === 'government' &&
          <div>
            <Dropdown
              className={css(styles.NewFundingModal_dropdown)}
              placeholder='Search agencies...'
              icon={null}
              fluid
              selection
              search={this.handleSearch}
              value={fundingSponsor.value}
              options={this.governmentOrganizationOptions}
              onChange={(e, selection) => {
                this.setState({
                  fundingSponsor: _.find(this.governmentOrganizationOptions, (option) => option.value === selection.value),
                });
              }}
            />
          </div>}
        {fundingSourceType === 'university' &&
          <div>
            <Dropdown
              className={css(styles.NewFundingModal_dropdown)}
              placeholder='Search universities...'
              icon={null}
              fluid
              selection
              closeOnChange
              search={this.handleUniversitySearchQuery}
              value={fundingSponsor.value || fundingSponsor.name}
              options={this.universityOptions}
              onChange={this.handleUniversityInputChange}
              onSearchChange={this.handleUniversitySearchChange}
              searchQuery={universitySearchQuery}
              loading={loadingUniversitySearch}
            />
          </div>}
        {fundingSourceType === 'government' && fundingSponsor.text === "National Insitute of Health (NIH)" &&
          <>
            <div className={css(styles.NewFundingModal_modalFieldLabel)}>
              NIH Grant Type
            </div>
            <div className='custom-dropdown'>
              <Dropdown
                className={css(styles.NewFundingModal_dropdown)}
                placeholder='Please select...'
                icon={null}
                fluid
                selection
                value={fundingGrantType}
                options={nihOptions}
                onChange={(e, selection) => {
                  this.setState({
                    fundingGrantType: selection.value,
                  });
                }}
              />
            </div>
          </>
        }
        {fundingSponsor.key === ('other_sponsor') &&
          <>
            <div className={css(styles.NewFundingModal_modalFieldLabel)}>
              Other
            </div>
            <input
              className={css(styles.NewFundingModal_modalInput)}
              placeholder='Specify name of sponsor...'
              value={otherSponsor}
              onChange={(e) => this.handleChange(e, 'otherSponsor')}
            />
          </>
        }
      </>
    )
  }

  render() {
    const {
      title,
      fundingModalOpen,
      inEditMode
    } = this.props;
    const {
      fundingModalLoading,
      fundingTitle,
      fundingDescription,
      fundingAmount,
      fundingSponsor,
      otherSponsor,
      searchQuery,
      fundingMonth,
      fundingYear,
      fundingEndMonth,
      fundingEndYear,
      fundingURL,
      fundingSourceType,
      fundingGrantType,
      isAwardRecipient
    } = this.state;

    let dropdownOptions;
    if (searchQuery.length >= 1) {
      dropdownOptions = this.companyOptions;
    } else {
      dropdownOptions = fundingSponsor.key ? [fundingSponsor] : [];
    }

    const validFunding = fundingTitle &&
                         fundingSourceType &&
                         fundingDescription &&
                         fundingAmount &&
                         fundingSponsor.key &&
                         !(fundingSponsor.key === 'other_sponsor' && !otherSponsor);

    return (
      <Modal
        open={fundingModalOpen}
        onClose={() => this.closeModal()}
        size="small"
        closeOnDimmerClick={false}
        className={css(styles.NewFundingModal_modal)}
      >
        <Modal.Content>
          <div className={css(styles.NewFundingModal_modalHeader)}>{title}</div>

          <div className={css(styles.NewFundingModal_modalFieldLabel)}>
            Source
          </div>
          <div className='custom-dropdown'>
            <Dropdown
              className={css(styles.NewFundingModal_dropdown)}
              icon='chevron down'
              placeholder='Please select...'
              fluid
              selection
              value={fundingSourceType}
              options={gon.funding_source_types}
              onChange={(e, selection) => {
                this.setState({
                  fundingSponsor: {},
                  fundingSourceType: selection.value,
                });
              }}
            />
          </div>

          {this.renderFundingSourceSelector()}

          <div className={css(styles.NewFundingModal_modalFieldLabel)}>
            Title
          </div>
          <div>
            <input
              className={css(styles.NewFundingModal_modalInput)}
              placeholder='Ex: Examining the impact of working memory on the influence of salience in real-world displays'
              value={fundingTitle}
              type="text"
              onChange={(e) => this.handleChange(e, 'fundingTitle')}
            />
          </div>
          <div className={css(styles.NewFundingModal_modalFieldLabel)}>
            Link
          </div>
          <div>
            <input
              className={css(styles.NewFundingModal_modalInput)}
              placeholder='(optional)'
              value={fundingURL}
              type="text"
              onChange={(e) => this.handleChange(e, 'fundingURL')}
            />
          </div>
          <div className={css(styles.NewFundingModal_modalFieldLabel)}>
            Abstract
          </div>
          <div>
            <textarea
              className={css(styles.NewFundingModal_modalInput, styles.NewFundingModal_textarea)}
              placeholder=''
              type='textarea'
              value={fundingDescription}
              onChange={(e) => this.handleChange(e, 'fundingDescription')}
            />
          </div>

          <div className={css(styles.NewFundingModal_modalFieldLabel)}>
            Start Date
          </div>
          <div>
            <Dropdown
              className={css(styles.NewFundingModal_dateDropdown)}
              icon='chevron down'
              fluid
              selection
              placeholder="Month"
              style={{ marginRight: '4%' }}
              value={fundingMonth || ''}
              options={monthOptions}
              onChange={(e, selection) => this.handleTime(e, selection, 'fundingMonth')}
            />
            <Dropdown
              className={css(styles.NewFundingModal_dateDropdown)}
              icon='chevron down'
              fluid
              placeholder="Year"
              selection
              value={fundingYear || ''}
              options={yearOptions}
              onChange={(e, selection) => this.handleTime(e, selection, 'fundingYear')}
            />
          </div>

          {!this.state.fundingActive &&
            <>
              <div className={css(styles.NewFundingModal_modalFieldLabel)}>
                End Date
              </div>
              <div>
                <Dropdown
                  className={css(styles.NewFundingModal_dateDropdown)}
                  icon='chevron down'
                  fluid
                  selection
                  disabled={!fundingMonth || !fundingYear}
                  placeholder="Month"
                  style={{ marginRight: '4%' }}
                  value={fundingEndMonth || ''}
                  options={monthOptions}
                  options={_.filter(monthOptions, (month) => {
                    // if end year is same as start year ensure month is after start month
                    return fundingEndYear === fundingYear ? month.value > fundingMonth : true;
                  })}
                  onChange={(e, selection) => this.handleTime(e, selection, 'fundingEndMonth')}
                  />
                <Dropdown
                  className={css(styles.NewFundingModal_dateDropdown)}
                  icon='chevron down'
                  fluid
                  disabled={!fundingMonth || !fundingYear}
                  placeholder="Year"
                  selection
                  value={fundingEndYear || ''}
                  options={_.filter(yearOptions, (year) => year.key >= fundingYear)}
                  onChange={(e, selection) => this.handleTime(e, selection, 'fundingEndYear')}
                  />
              </div>
            </>
          }

          <div className={css(styles.NewFundingModal_activeCheckboxWrap)}>
            <label className={css(styles.NewFundingModal_activeCheckboxLabel)}>Active</label>
            <Checkbox
              onChange={() => this.setState({ fundingActive: !this.state.fundingActive })}
              checked={this.state.fundingActive}
            />
          </div>

          <div className={css(styles.NewFundingModal_modalFieldLabel)}>
            Amount
          </div>
          <div>
            <CurrencyInput prefix="$" className={css(styles.NewFundingModal_modalInput, styles.NewFundingModal_moneyInput)} value={fundingAmount} onChangeEvent={this.handleCurrencyAmount} />
          </div>

          <span className={css(styles.NewFundingModal_modalFieldLabel, styles.NewFundingModal_radioInputFormLabel)}>
            Were you the award recipient?
          </span>
          <Form className={css(styles.NewFundingModal_radioInputForm)}>
            <Form.Field className={css(styles.NewFundingModal_radioFormField)}>
              <Radio
                className={css(styles.NewFundingModal_radioInput)}
                label='Yes'
                name='awardRecipientRadio'
                value='true'
                checked={isAwardRecipient === true}
                onChange={(e, { value }) => this.setState({ isAwardRecipient: true })}
              />
            </Form.Field>
            <Form.Field className={css(styles.NewFundingModal_radioFormField)}>
              <Radio
                className={css(styles.NewFundingModal_radioInput)}
                label='No'
                name='awardRecipientRadio'
                value='false'
                checked={isAwardRecipient === false}
                onChange={(e, { value }) => this.setState({ isAwardRecipient: false })}
              />
            </Form.Field>
          </Form>

          <div className={css(styles.NewFundingModal_modalButtonHolder)}>
            {inEditMode &&
              <Button
                className={css(modalStyles.Modal_deleteButton)}
                type='submit'
                disabled={fundingModalLoading}
                onClick={this.handleDeleteFunding}
                >
                Delete
              </Button>
            }
            <Button
              className={css(styles.NewFundingModal_modalCancelButton)}
              type='submit'
              onClick={() => this.closeModal()}
            >
              Cancel
            </Button>
            <Button
              className={css(styles.NewFundingModal_modalSubmitButton)}
              type='submit'
              disabled={fundingModalLoading || !validFunding}
              onClick={this.handleSubmitFunding}
            >
              Submit
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

NewFundingModal.propTypes = {
  title: PropTypes.string,
  fetchFundings: PropTypes.func,
  fetchCompanies: PropTypes.func,
  fetchFoundations: PropTypes.func,
  fetchGovernmentOrganizations: PropTypes.func,
  toggleFundingModal: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    fundingModalOpen: state.profiles.fundingModalOpen,
    companies: state.defaultReducer.companies,
    fundings: state.profiles.fundings,
    currentFundingId: state.profiles.currentFundingId,
    inEditMode: !!state.profiles.currentFundingId,
    government_organizations: state.defaultReducer.government_organizations
  };
};

const mapDispatchToProps = {
  fetchFundings: fetchFundingsAction,
  fetchCompanies: fetchCompaniesAction,
  fetchFoundations: fetchFoundationsAction,
  fetchGovernmentOrganizations: fetchGovernmentOrganizationsAction,
  toggleFundingModal: toggleFundingModalAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewFundingModal);
