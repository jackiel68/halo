import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { Container, Form, Dropdown, Icon, Input, Button, Checkbox, Radio, Message } from 'semantic-ui-react'
import DatePicker from "react-datepicker";

import { COLORS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import { authenticityToken, getCookie } from '../../../marketplace/utils/requests';

import ResultRow from '../../../marketplace/components/ResultRow';

const expertiseOptions = gon.areas_of_expertise;
const innovationTypesOptions = gon.innovation_types;

const styles = StyleSheet.create({
  RFPForm_logoBanner: {
    textAlign: 'center',
    backgroundColor: COLORS.snowWhite,
    paddingTop: '15px',
    paddingBottom: '15px',
    marginBottom: '50px',
    borderBottom: `1px solid ${COLORS.transparentGray}`,
  },
  RFPForm_backButton: {
    fontSize: '14px',
    marginTop: '-20px',
    marginLeft: '-50px',
  },
  RFPForm_backButtonLink: {
    textDecoration: 'none',
    color: COLORS.darkGray,
    fontWeight: 600,
  },
  RFPForm_form: {
    width: '80%',
    margin: 'auto',
  },
  RFPForm_datepicker: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '14px',
  },
  RFPForm_header: {
    fontWeight: 600,
    fontSize: '15px',
    color: COLORS.darkGray,
    marginBottom: '10px',
    marginTop: '30px',
  },
  RFPForm_inputText: {
    fontSize: '14px',
  },
  RFPForm_dropdown: {
    margin: 'auto',
    flexWrap: 'wrap',
    fontSize: '14px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
  },
  RFPForm_keywordDropdown: {
    margin: 'auto',
    fontSize: '14px',
    minHeight: '48px',
    paddingTop: '8px',
  },
  RFPForm_label: {
    color: COLORS.gray,
    fontWeight: 'regular',
    fontSize: '14px',
    fontWeight: 700,
  },
  RFPForm_checkboxLabel: {
    color: COLORS.gray,
    fontWeight: 'regular',
    display: 'block',
    marginBottom: '-25px',
    paddingLeft: '25px',
    fontSize: '14px',
  },
  RFPForm_textarea: {
    fontSize: '14px',
  },
  RFPForm_bulletField: {
    fontSize: '14px',
    width: '95%',
    display: 'inline-block',
    marginRight: '2%',
  },
  RFPForm_otherResourceField: {
    width: '100%',
    marginBottom: '20px',
    fontSize: '14px',
  },
  RFPForm_deadlineContainer: {
    marginTop: '20px',
    fontSize: '14px',
  },
  RFPForm_deadlineField: {
    width: '100%',
    marginBottom: '20px',
    fontSize: '14px',
  },
  RFPForm_submitButtonHolder: {
    width: '100%',
  },
  RFPForm_submitButton: {
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    marginTop: '20px',
    width: '100%',
  },
  RFPForm_needHelpContainer: {
    marginTop: '20px',
    marginBottom: '50px',
    textAlign: 'center',
  },
  RFPForm_needHelpLink: {
    color: COLORS.darkGray,
    fontSize: '14px',
    textDecoration: 'none',
  },
  RFPForm_plusIcon: {
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
});

class RFPForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deadline: '',
      innovationTypes: [],
      therapeuticArea: '',
      whyItMatters: '',
      inScopeProposals: [''],
      outOfScopeProposals: [''],
      availableResources: [],
      otherResource: '',
      additionalResources: '',
      title: '',
      summary: '',
      errors: {},
      autoFocus: false,
    };
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const {
      deadline,
      innovationTypes,
      whyItMatters,
      inScopeProposals,
      outOfScopeProposals,
      availableResources,
      otherResource,
      additionalResources,
      therapeuticArea,
      title,
      summary,
    } = this.state;

    this.setState({
      isSubmitting: true,
      errors: {},
      hasSubmitted: true,
    });

    const formData = new FormData();
    formData.append('request_for_proposal[title]', title);
    formData.append('request_for_proposal[summary]', summary);
    formData.append('request_for_proposal[innovation_types]', innovationTypes);
    formData.append('request_for_proposal[why_it_matters]', whyItMatters);
    formData.append('request_for_proposal[in_scope_proposals]', inScopeProposals.filter((proposal) => proposal.length > 0).join('****'));
    formData.append('request_for_proposal[out_of_scope_proposals]', outOfScopeProposals.filter((proposal) => proposal.length > 0).join('****'));
    formData.append('request_for_proposal[available_resources]', availableResources);
    formData.append('request_for_proposal[other_resource]', otherResource);
    formData.append('request_for_proposal[additional_resources]', additionalResources);
    formData.append('request_for_proposal[deadline]', deadline);
    formData.append('request_for_proposal[therapeutic_area]', therapeuticArea);

    try {
      const rfpResponse = await fetch('/request_for_proposals', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await rfpResponse.json();
      if (responseJson.errors && Object.keys(responseJson.errors).length > 0) {
        this.setState({
          isSubmitting: false,
          errors: responseJson.errors,
        });
      } else {
        this.setState({ isSubmitting: false });
        window.location.href = '/';
      }
    } catch(err) {
      this.setState({ isSubmitting: false });
    }
  };

  handleChange = (e, selection, maxLength) => {
    this.setState({
      hasSubmitted: false,
      [selection.name]: maxLength ? selection.value.slice(0, maxLength) : selection.value,
    });
  };

  handleAppendingFields = (e, selection, name, index) => {
    const fields = this.state[name].slice();
    fields[index] = selection.value;
    this.setState({
      hasSubmitted: false,
      [name]: fields,
    });
  };

  handleAddingNewField = (name) => {
    const fields = this.state[name].slice();
    fields.push("");
    this.setState({
      autoFocus: true,
      hasSubmitted: false,
      [name]: fields,
    });
  };

  handleAvailableResources = (resource) => {
    const {
      availableResources,
    } = this.state;

    if (!availableResources.includes(resource)) {
      this.setState({
        hasSubmitted: false,
        availableResources: availableResources.concat(resource)
      });
    } else {
      this.setState({
        hasSubmitted: false,
        availableResources: availableResources.filter((el) => {
          return el != resource;
        }),
      });
    }
  };

  render() {
    const {
      deadline,
      title,
      summary,
      innovationTypes,
      whyItMatters,
      therapeuticArea,
      inScopeProposals,
      outOfScopeProposals,
      availableResources,
      otherResource,
      additionalResources,
      isSubmitting,
      errors,
      autoFocus,
    } = this.state;

    return (
      <div>
        <div className={css(styles.RFPForm_logoBanner)}>
          <img src={haloLogo} />
        </div>
        <Container>
          <div className={css(styles.RFPForm_backButton)}>
            <a href="/" className={css(styles.RFPForm_backButtonLink)}>
              <Icon name='angle left' /> Back
            </a>
          </div>
          <div className={css(styles.RFPForm_form)}>
            <Form onSubmit={this.handleSubmit} error={errors && Object.keys(errors).length > 0}>
              <div className={css(styles.RFPForm_header)}>
                Request for Proposal Form
              </div>
              <div>
                <div className={css(styles.RFPForm_label)}>
                  RFP Title and Summary
                </div>
                <div className={css(styles.RFPForm_subheader)}>
                  Scientists see your RFP title and summary in search results.
                  <br />
                  A concise, well-written description helps ensure you receive the most relevant proposals.
                  <br />
                  <br />
                  Preview (will fill out as you complete the form):
                  <br />
                  <ResultRow
                    company={gon.user_company_name}
                    title={title || "Give a short title for the request here"}
                    summary={summary || "This is a summary of the request for proposal with just a few short sentences."}
                    therapeuticArea={gon.areas_of_expertise_mapping[therapeuticArea] || "Research Area"}
                    innovationTypes={
                      innovationTypes.length === 0 ?
                        ["Innovation", "Technology"] :
                        innovationTypes.map(itype => gon.innovation_type_mapping[itype])
                    }
                  />
                  <div className={css(styles.RFPForm_inputText)}>
                    <Form.Field>
                      <label className={css(styles.RFPForm_label)}>Title (100 characters or less)</label>
                      <Form.Input
                        error={errors.title ? true : null}
                        name='title'
                        placeholder='Title'
                        value={title}
                        onChange={(e, selection) => this.handleChange(e, selection, 100)}
                      />
                    </Form.Field>
                  </div>
                  <div className={css(styles.RFPForm_inputText)}>
                    <Form.Field>
                      <label className={css(styles.RFPForm_label)}>
                        Summary (250 characters or less)
                      </label>
                      <Form.TextArea
                        className={css(styles.RFPForm_textarea)}
                        error={errors.summary ? true : null}
                        name='summary'
                        rows='5'
                        placeholder='Summary of request'
                        value={summary}
                        onChange={(e, selection) => this.handleChange(e, selection, 250)}
                      />
                    </Form.Field>
                  </div>
                </div>
              </div>

              <div>
                <div className={css(styles.RFPForm_label)}>
                  Innovation Type (3 or less)
                </div>
                <div className="onboarding-dropdown">
                  <Dropdown
                    className={css(styles.RFPForm_keywordDropdown)}
                    placeholder='+ Select all innovation types'
                    name="innovationTypes"
                    fluid
                    selection
                    multiple
                    search
                    value={innovationTypes}
                    options={innovationTypesOptions}
                    onChange={(e, selection) => this.handleChange(e, selection, 3)}
                  />
                </div>
              </div>
              <div >
                <Form.Field>
                <label className={css(styles.RFPForm_label)}>
                  What is your area of expertise?
                </label>
                <div className="custom-dropdown">
                  <Dropdown
                    className={css(styles.RFPForm_dropdown)}
                    icon="chevron down"
                    error={errors.therapeutic_area ? true : null}
                    placeholder='Therapeutic Area'
                    name="therapeuticArea"
                    options={expertiseOptions}
                    fluid
                    selection
                    onChange={this.handleChange}
                  />
                </div>
                </Form.Field>
                <div>
                  <Form.Field>
                    <label className={css(styles.RFPForm_label)}>
                      Why does it matter to your company?
                    </label>
                    <Form.TextArea
                      className={css(styles.RFPForm_textarea)}
                      name='whyItMatters'
                      rows='5'
                      placeholder='Why does it matter?'
                      value={whyItMatters}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                </div>
                <br />
                <div>
                  <Form.Field>
                    <label className={css(styles.RFPForm_label)}>
                      What proposals are in scope?
                    </label>
                    {inScopeProposals.map((inScopeProposal, i) => {
                      return (
                        <Form.Input
                          autoFocus={autoFocus}
                          key={`inscope-${i}`}
                          className={css(styles.RFPForm_bulletField)}
                          name='inScopeProposals'
                          placeholder='Add bullet point here'
                          value={inScopeProposals[i]}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              this.handleAddingNewField('inScopeProposals');
                            }
                          }}
                          onChange={(e, selection) => this.handleAppendingFields(e, selection, 'inScopeProposals', i)}
                        />
                      );
                    })}
                    <Icon className={css(styles.RFPForm_plusIcon)} name="plus" onClick={() => this.handleAddingNewField('inScopeProposals')} />
                  </Form.Field>
                </div>
                <br />
                <div>
                  <Form.Field>
                    <label className={css(styles.RFPForm_label)}>
                      What proposals are out of scope?
                    </label>
                    {outOfScopeProposals.map((outOfScopeProposal, i) => {
                      return (
                        <Form.Input
                          autoFocus={autoFocus}
                          key={`inscope-${i}`}
                          className={css(styles.RFPForm_bulletField)}
                          name='outOfScopeProposals'
                          placeholder='Add bullet point here'
                          value={outOfScopeProposals[i]}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              this.handleAddingNewField('outOfScopeProposals');
                            }
                          }}
                          onChange={(e, selection) => this.handleAppendingFields(e, selection, 'outOfScopeProposals', i)}
                        />
                      );
                    })}
                    <Icon className={css(styles.RFPForm_plusIcon)} name="plus" onClick={() => this.handleAddingNewField('outOfScopeProposals')} />
                  </Form.Field>
                </div>
              </div>
              <hr />
              <div>
                <div className={css(styles.RFPForm_label)}>
                  What resources are available to investigators?
                </div>
                <div>
                  <Form.Group grouped>
                    <Form.Checkbox
                      label={<label className={css(styles.RFPForm_checkboxLabel)}>Funding</label>}
                      name='availableResources'
                      value='Funding'
                      checked={availableResources.includes('funding')}
                      onChange={() => this.handleAvailableResources('funding')}
                    />
                    <Form.Checkbox
                      label={<label className={css(styles.RFPForm_checkboxLabel)}>Compounds / Reagents</label>}
                      name='availableResources'
                      value='Compounds / Reagents'
                      checked={availableResources.includes('compounds_reagents')}
                      onChange={() => this.handleAvailableResources('compounds_reagents')}
                    />
                    <Form.Checkbox
                      label={<label className={css(styles.RFPForm_checkboxLabel)}>Tools / Technologies</label>}
                      name='availableResources'
                      value='Tools / Technologies'
                      checked={availableResources.includes('tools_technologies')}
                      onChange={() => this.handleAvailableResources('tools_technologies')}
                    />
                    <Form.Checkbox
                      label={<label className={css(styles.RFPForm_checkboxLabel)}>Mentorship / Expertise</label>}
                      name='availableResources'
                      value='Mentorship / Expertise'
                      checked={availableResources.includes('mentorship_expertise')}
                      onChange={() => this.handleAvailableResources('mentorship_expertise')}
                    />
                    <Form.Checkbox
                      label={<label className={css(styles.RFPForm_checkboxLabel)}>Lab Space</label>}
                      name='availableResources'
                      value='Lab Space'
                      checked={availableResources.includes('lab_space')}
                      onChange={() => this.handleAvailableResources('lab_space')}
                    />
                    <Form.Checkbox
                      label={<label className={css(styles.RFPForm_checkboxLabel)}>Other</label>}
                      name='availableResources'
                      value='Other'
                      checked={availableResources.includes('other')}
                      onChange={() => this.handleAvailableResources('other')}
                    />
                  </Form.Group>
                  <div className={css(styles.RFPForm_inputText)}>
                    <Form.Field>
                      <Form.Input
                        disabled={!availableResources.includes('other')}
                        name='otherResource'
                        placeholder='Other resource'
                        value={otherResource}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  </div>
                  <br />
                </div>
                <div>
                  <Form.Field>
                    <label className={css(styles.RFPForm_label)}>Additional details on resources provided</label>
                    <Form.TextArea
                      className={css(styles.RFPForm_textarea)}
                      name='additionalResources'
                      rows='5'
                      placeholder='Additional details on resources'
                      value={additionalResources}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                </div>
                <div className={css(styles.RFPForm_deadlineContainer)}>
                  <Form.Field>
                    <label className={css(styles.RFPForm_label)}>Proposal Deadline</label>
                    <div>Leave blank if you do not have a deadline</div>
                    <DatePicker
                      selected={deadline}
                      name='deadline'
                      className={css(styles.RFPForm_datepicker)}
                      onChange={(newDate) => {
                        this.setState({ hasSubmitted: false, deadline: newDate });
                      }}
                    />
                  </Form.Field>
                </div>
                <Message
                  error
                  header='Invalid form submission'
                  list={Object.keys(errors).map(fieldName => {
                    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).split('_').join(' ')} ${errors[fieldName]}, please try again`;
                  })}
                />
                <div className={css(styles.RFPForm_submitButtonHolder)}> 
                  <Button
                    className={css(styles.RFPForm_submitButton)}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    type='submit'
                  >
                    Submit Request for Proposal
                  </Button>
                  <div className={css(styles.RFPForm_needHelpContainer)}>
                    <a className={css(styles.RFPForm_needHelpLink)} href="/" target="_blank">
                      Need Help?
                    </a>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    );
  }
}

export default RFPForm;
