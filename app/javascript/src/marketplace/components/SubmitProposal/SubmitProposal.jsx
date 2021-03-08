import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Radio, Grid, Dropdown, Button, Icon, Modal, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import CurrencyInput from 'react-currency-input';
import moment from 'moment';

import { COLORS, WINDOW_DIMENSIONS } from '../../../../constants';
import haloLogo from '../../../../images/logos/halo_logo.svg';
import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import ProposalAttachments from './ProposalAttachments';
import {
  authenticityToken,
} from '../../utils/requests';
import { transformText } from '../../utils/textUtils';

const TOTAL_STEPS = 6.0;

const { TABLET_LANDSCAPE_MEDIA_QUERY, MOBILE_MEDIA_QUERY } = WINDOW_DIMENSIONS;

const styles = StyleSheet.create({
  SubmitProposal_logoBanner: {
    textAlign: 'center',
    backgroundColor: COLORS.snowWhite,
    paddingTop: '15px',
    paddingBottom: '15px',
    marginBottom: '30px',
  },
  SubmitProposal_progressBar: {
    backgroundColor: COLORS.lightBlue,
    height: '4px',
  },
  SubmitProposal_container: {
    position: 'relative',
    marginBottom: '100px',
  },
  SubmitProposal_rfpContainer: {
    textAlign: 'left',
    top: '-10px',
    position: 'relative',
  },
  SubmitProposal_exampleDescription: {
    textAlign: 'left',
    fontSize: '13px',
    lineHeight: '29px',
    color: COLORS.gray,
    fontSize: '13px',
    lineHeight: '29px',
    marginBottom: '20px',
  },
  SubmitProposal_checkboxGroup: {
    textAlign: 'left',
    fontSize: '13px',
    lineHeight: '29px',
  },
  SubmitProposal_stepTab: {
    flex: 1,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '16px',
    color: COLORS.lightGray,
    paddingBottom: '33px',
    borderBottom: `1px solid ${COLORS.lightGray}`,
  },
  SubmitProposal_activeTab: {
    color: COLORS.lightBlack,
    borderBottom: `2px solid ${COLORS.lightBlue}`,
  },
  SubmitProposal_stepContainer: {
    textAlign: 'center',
    margin: 'auto',
    position: 'relative',
  },
  SubmitProposal_stepDescription: {
    margin: '0px 0 24px',
    color: COLORS.lightBlack,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600,
    textAlign: 'left',
  },
  SubmitProposal_stepDescriptionOptional: {
    margin: '0px 0 24px',
    color: COLORS.lightBlack,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    textAlign: 'left',
  },
  SubmitProposal_checkboxGroupLabel: {
    fontSize: '16px',
    color: COLORS.lightBlack,
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'left',
    marginBottom: '10px',
  },
  SubmitProposal_checkboxLabel: {
    paddingLeft: '25px',
    fontSize: '13px',
    minHeight: '20px',
    fontWeight: 500,
  },
  SubmitProposal_fieldLabel: {
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.darkGray,
    marginBottom: '5px',
    width: '100%',
  },
  SubmitProposal_input: {
    width: '100%',
    padding: '10px',
    display: 'grid',
    fontSize: '14px',
  },
  SubmitProposal_dropdownInput: {
    marginBottom: '20px',
  },
  SubmitProposal_fundingDropdown: {
    width: '100%',
    height: '48px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0px',
    color: COLORS.defaultText,
    border: `1px solid ${COLORS.defaultText}`,
  },
  SubmitProposal_footerHolder: {
    textAlign: 'left',
  },
  SubmitProposal_stepCounter: {
    display: 'inline-block',
    width: '30%',
    fontSize: '11px',
    fontWeight: 'bold',
    color: COLORS.lightBlack,
    marginTop: '60px',
  },
  SubmitProposal_stepButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'left',
  },
  SubmitProposal_stepButtonHolderRight: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
  },
  SubmitProposal_modalButtonHolder: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '20px',
  },
  SubmitProposal_stepBackButton: {
    height: '48px',
    textAlign: 'center',
    color: COLORS.lightBlack,
    backgroundColor: COLORS.white,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  },
  SubmitProposal_modalCancelButton: {
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
  SubmitProposal_stepIcon: {
    margin: '0',
  },
  SubmitProposal_backButtonLink: {
    textDecoration: 'none',
    color: COLORS.darkGray,
    fontWeight: 600,
  },
  SubmitProposal_saveContinueButtonHolder: {
    display: 'inline-block',
    width: '50%',
    textAlign: 'left',
    position: 'absolute',
    left: '30px',
    top: '0px',
  },
  SubmitProposal_saveContinueLink: {
    textDecoration: 'none',
    color: COLORS.darkGray,
    fontWeight: 600,
    fontSize: '14px',
    marginTop: '20px',
    cursor: 'pointer',
  },
  SubmitProposal_submitApplicationButton: {
    backgroundColor: COLORS.pink,
    width: '166px',
    maxWidth: '50%',
    height: '48px',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    marginLeft: '4%',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      maxWidth: 'unset',
      margin: '0'
    }
  },
  SubmitProposal_dropdown: {
    width: '100%',
    minHeight: '38px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0px',
    paddingTop: '10px',
    color: COLORS.defaultText,
  },
  SubmitProposal_modal: {
    overflow: 'visible',
  },
  SubmitProposal_modalFieldLabel: {
    textAlign: 'left',
    margin: '10px 0 6px',
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.labelGray,
  },
  SubmitProposal_modalInput: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    height: '50px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  SubmitProposal_modalTextArea: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  SubmitProposal_modalHeader: {
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px',
    color: COLORS.lightBlack,
    marginBottom: '32px',
  },
  SubmitProposal_modalSubheader: {
    fontSize: '14px',
    color: COLORS.lightBlack,
    marginTop: '-32px',
    marginBottom: '32px',
  },
  SubmitProposal_datepicker: {
    width: '100%',
    height: '50px',
    padding: '10px',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '14px',
  },
  SubmitProposal_plusIcon: {
    marginRight: '10px',
    color: COLORS.white,
    backgroundColor: COLORS.lightBlue,
    borderRadius: '10px',
    height: '15px',
    width: '15px',
    padding: '1px 2px',
    fontSize: '10px',
  },
  SubmitProposal_addMoreText: {
    color: COLORS.lightBlue,
  },
  SubmitProposal_modalSubmitButton: {
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
  SubmitProposal_endingBackground: {
    width: '100%',
  },
  SubmitProposal_submissionContainer: {
    width: '60%',
    margin: '50px auto',
    textAlign: 'left',
  },
  SubmitProposal_applicationSubmitted: {
    fontSize: '18px',
    lineHeight: '80px',
    color: COLORS.lightBlack,
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  SubmitProposal_finalText: {
    fontSize: '14px',
    lineHeight: '28px',
    color: COLORS.lightBlack,
    marginBottom: '16px',
  },
  SubmitProposal_finalButtonHolder: {
    textAlign: 'center',
    marginTop: '30px',
  },
  SubmitProposal_goToProfileButton: {
    display: 'inline-block',
    padding: '18px 28px',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    border: `1px solid ${COLORS.pink}`,
    backgroundColor: COLORS.pink,
    color: COLORS.white,
    fontSize: '15px',
    marginRight: '30px',
  },
  SubmitProposal_goToMarketplaceButton: {
    display: 'inline-block',
    padding: '18px 28px',
    backgroundColor: COLORS.pink,
    borderRadius: '4px',
    border: `1px solid ${COLORS.pink}`,
    color: COLORS.white,
    fontSize: '15px',
  },
  SubmitProposal_dateDropdown: {
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
  SubmitProposal_largeDropdown: {
    width: '100%',
    height: '48px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0px',
    color: COLORS.defaultText,
    border: `1px solid ${COLORS.defaultText}`,
  },
  SubmitProposal_entryFields: {
    display: 'inline-block',
    width: '65%',
    position: 'relative',
    verticalAlign: 'top',
    top: '30px',
  },
  SubmitProposal_exampleSection: {
    display: 'inline-block',
    marginLeft: '5%',
    width: '30%',
    verticalAlign: 'top',
    top: '90px',
    position: 'relative',
  },
  SubmitProposal_backButton: {
    backgroundColor: COLORS.white,
    width: '166px',
    height: '48px',
    textAlign: 'center',
    color: COLORS.lightBlack,
    border: `1px solid ${COLORS.lightGray}`,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    marginTop: '40px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      marginBottom: '1em'
    }
  },
  SubmitProposal_finalBackButton: {
    backgroundColor: COLORS.white,
    width: '166px',
    height: '48px',
    textAlign: 'center',
    color: COLORS.lightBlack,
    border: `1px solid ${COLORS.lightGray}`,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%',
      marginBottom: '1em'
    }
  },
  SubmitProposal_continueButton: {
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    width: '166px',
    height: '48px',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    marginTop: '50px',
    [MOBILE_MEDIA_QUERY]: {
      width: '100%'
    }
  },
  SubmitProposal_company: {
    marginTop: '50px',
  },
  SubmitProposal_companyLink: {
    color: COLORS.gray,
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '30px',
  },
  SubmitProposal_title: {
    color: COLORS.lightBlack,
    fontSize: '18px',
    lineHeight: '26px',
    fontWeight: 600,
  },
  SubmitProposal_summary: {
    color: COLORS.lightBlack,
    fontSize: '14px',
    fontWeight: 400,
    marginBottom: '10px',
  },
  SubmitProposal_bulletList: {
    marginLeft: '15px',
    marginBottom: '2em'
  },
  SubmitProposal_bulletPoint: {
    color: COLORS.lightBlack,
    fontSize: '13px',
    fontWeight: 300,
    letterSpacing: '0.5px',
    lineHeight: '24px',
  },
  SubmitProposal_deadline: {
    display: 'inline-block',
    padding: '8px 0px',
    color: COLORS.darkGray,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '10px',
  },
  SubmitProposal_shareButton: {
    backgroundColor: COLORS.snowWhite,
    border: `1px solid ${COLORS.gray}`,
    borderRadius: '4px',
    padding: '8px 20px',
    color: COLORS.gray,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '13px',
    marginRight: '8px',
    marginLeft: '8px',
  },
  SubmitProposal_saveButton: {
    backgroundColor: COLORS.snowWhite,
    border: `1px solid ${COLORS.gray}`,
    borderRadius: '4px',
    padding: '8px 20px',
    color: COLORS.gray,
    lineHeight: '15px',
    fontWeight: 500,
    fontSize: '13px',
    marginRight: '8px',
    marginLeft: '8px',
  },
  SubmitProposal_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  SubmitProposal_sectionContent: {
    color: COLORS.lightBlack,
    fontSize: '13px',
    fontWeight: 300,
    letterSpacing: '0.5px',
    lineHeight: '24px',
    marginBottom: '2em',
  },
  SubmitProposal_section: {
  },
  SubmitProposal_verifiedIcon: {
    marginLeft: '5px',
    marginRight: '5px',
  },
  SubmitProposal_tag: {
    border: `1px solid ${COLORS.gray}`,
    borderRadius: '24px',
    padding: '8px 20px',
    fontSize: '12px',
    width: 'fit-content',
    marginRight: '10px',
    display: 'inline-block',
    marginBottom: '10px',
  },
  SubmitProposal_therapeuticArea: {
    fontSize: '11px',
    marginTop: '5px',
    marginRight: '10px',
    padding: '4px 10px',
    color: COLORS.lightBlue,
    border: `1px solid ${COLORS.lightBlue}`,
    borderRadius: '4px',
    width: 'fit-content',
    display: 'inline-block',
  },
  SubmitProposal_innovationType: {
    fontSize: '11px',
    display: 'inline-block',
    padding: '4px 10px',
    color: COLORS.lightBlack,
    border: `1px solid ${COLORS.lightBlack}`,
    borderRadius: '4px',
    width: 'fit-content',
    marginRight: '10px',
  },
  SubmitProposal_viewMore: {
    color: COLORS.gray,
    fontSize: '14px',
    cursor: 'pointer',
  },
  SubmitProposal_proposalReviewSection: {
    display: 'inline-block',
    width: '50%',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
    },
  },
  SubmitProposal_rfpReviewSection: {
    display: 'inline-block',
    width: '50%',
    paddingLeft: '60px',
    verticalAlign: 'top',
    [TABLET_LANDSCAPE_MEDIA_QUERY]: {
      width: '100%',
    },
    [MOBILE_MEDIA_QUERY]: {
      paddingLeft: '0px',
    },
  },
  SubmitProposal_rfpReviewSectionHeader: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '150px',
    textAlign: 'left',
    color: COLORS.lightBlack,
    marginBottom: '-24px',
    verticalAlign: 'top',
  },
  SubmitProposal_proposalReviewHeader: {
    fontSize: '24px',
    textAlign: 'left',
    fontWeight: 600,
    color: COLORS.lightBlack,
    marginTop: '100px',
    marginBottom: '6px',
    lineHeight: '33px',
  },
  SubmitProposal_proposalReviewDescription: {
    color: COLORS.lightBlack,
    fontWeight: 500,
    fontSize: '14px',
    textAlign: 'left',
    marginBottom: '20px',
    lineHeight: '19px',
  },
  SubmitProposal_proposalReviewSectionHeader: {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    color: COLORS.lightBlack,
    marginTop: '15px',
    marginBottom: '12px',
  },
  SubmitProposal_proposalReviewSectionContent: {
    textAlign: 'left',
    fontSize: '12px',
    lineHeight: '16px',
    color: COLORS.lightBlack,
  },
  SubmitProposal_submittingForPISection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: '22px',
    fontSize: '14px',
  },
  SubmitProposal_submittedForPICheckbox: {
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '4%',
    height: '15px',
  },
  SubmitProposal_submissionBullet: {
    marginBottom: '30px',
    marginTop: '30px',
    display: 'flex',
  },
  SubmitProposal_numberedBullet: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: '100%',
    textAlign: 'center',
    marginRight: '20px',
    color: COLORS.white,
    fontSize: '14px',
    width: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    height: '30px',
  },
  SubmitProposal_bulletText: {
    color: COLORS.lightBlack,
    fontSize: '14px',
  },
  SubmitProposal_confidential: {
    display: 'flex',
    marginTop: '2rem',
  }
});

const nihOptions = gon.nih_grant_types.map((nihType) => {
  return {
    key: nihType,
    text: nihType,
    value: nihType,
  };
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

const SUBMISSION_BULLETS = [
  'Your proposal is sent to the sponsor',
  'Sponsor reviews your proposal and profile',
  'Sponsor follows up with next steps or feedback',
];

class SubmitProposal extends PureComponent {
  constructor(props) {
    super(props);
    let existingCurrentStep;
    if (gon.existing_proposal && localStorage && localStorage.getItem(`submit-proposal-${gon.rfp_id}`)) {
      existingCurrentStep = Number(localStorage.getItem(`submit-proposal-${gon.rfp_id}`));
    }

    this.state = {
      currentStep: existingCurrentStep || 1,
      earlySaved: false,
      researchHypothesis: gon.existing_proposal ? gon.existing_proposal.research_hypothesis : '',
      hypothesisBasis: gon.existing_proposal ? gon.existing_proposal.hypothesis_basis : '',
      validationProcedure: gon.existing_proposal ? gon.existing_proposal.validation_procedure : '',
      futureValidation: gon.existing_proposal ? gon.existing_proposal.future_validation : '',
      isSubmitting: false,
      isExpanded: false,
      hasSubmitted: false,
      submittedForPI: gon.existing_proposal ? gon.existing_proposal.submitted_for_pi : false,
      noConfidential: false,
      errors: undefined,
      selectedPublications: gon.existing_proposal ? gon.proposal_publications : [],
      selectedPatents: gon.existing_proposal ? gon.proposal_patents : [],
      selectedFundings: gon.existing_proposal ? gon.proposal_fundings : [],
    };
  }

  convertMonthName = (month) => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
  }

  renderLabel = (label) => ({
    content: `${label.text.slice(0, 15)}${label.text.length > 14 ? '...' : ''}`,
  })

  incrementStep = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState((prevState) => {
      return {
        currentStep: prevState.currentStep + 1,
      };
    })
  };

  decrementStep = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState((prevState) => {
      return {
        currentStep: prevState.currentStep - 1,
      };
    })
  };

  handleTime = (e, selection, attr) => {
    this.setState({ [attr]: selection.value });
  };

  handleHypothesis = (e, selection) => {
    this.setState({
      researchHypothesis: e.target.value.slice(0, 500),
    });
  };

  handleHypothesisBasis = (e, selection) => {
    this.setState({
      hypothesisBasis: e.target.value.slice(0, 500),
    });
  };

  handleValidationProcedure = (e, selection) => {
    this.setState({
      validationProcedure: e.target.value.slice(0, 500),
    });
  };

  handleFutureValidation = (e, selection) => {
    this.setState({
      futureValidation: e.target.value.slice(0, 500),
    });
  };

  handleCurrencyAmount = (e, maskedValue, floatValue) => {
    this.setState({ fundingAmount: floatValue })
  }

  onConfidentialCheckboxSelect = (e, selection) => {
    this.setState({
      [selection.name]: selection.checked,
    });
  }

  handleSubmittedForPi = (e, selection) => {
    this.setState({
      submittedForPI: selection.value,
    });
  }

  handleSubmit = async (e, earlySave) => {
    e.preventDefault();
    const {
      researchHypothesis,
      hypothesisBasis,
      validationProcedure,
      futureValidation,
      currentStep,
      selectedPatents,
      selectedPublications,
      selectedFundings,
      submittedForPI,
    } = this.state;

    if (localStorage) {
      localStorage.setItem(`submit-proposal-${gon.rfp_id}`, currentStep);
    }

    this.setState({
      isSubmitting: true,
      errors: {},
    });

    const formData = new FormData();
    formData.append('proposal[research_hypothesis]', researchHypothesis);
    formData.append('proposal[hypothesis_basis]', hypothesisBasis);
    formData.append('proposal[validation_procedure]', validationProcedure);
    formData.append('proposal[future_validation]', futureValidation);
    formData.append('proposal[request_for_proposal_id]', gon.rfp_id);
    formData.append('proposal[patents]', selectedPatents);
    formData.append('proposal[fundings]', selectedFundings);
    formData.append('proposal[publications]', selectedPublications);

    if (submittedForPI) {
      formData.append('proposal[submitted_for_pi]', submittedForPI);
    }

    if (!earlySave) {
      formData.append('proposal[completed]', true);
    }

    try {
      const proposalResponse = await fetch('/proposals', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': authenticityToken(),
        }
      });
      const responseJson = await proposalResponse.json();
      if (responseJson.errors) {
        this.setState({
          isSubmitting: false,
          errors: responseJson.errors,
        });
      } else {
        const proposal = responseJson.proposal;
        if (earlySave) {
          this.setState({
            earlySaved: true,
          });
          window.location.href = `/research/${gon.rfp.research_area}/${gon.rfp.identifier}?saved=true`;
        } else {
          this.setState({
            hasSubmitted: true,
          });
          window.location.href = `/submit_proposal/${gon.rfp.identifier}/confirmation/${proposal.identifier}`;
        }
      }
    } catch(err) {
      this.setState({ isSubmitting: false });
    }
  };

  renderFooter = (valid) => {
    const { currentStep } = this.state;

    return (
      <div className={css(styles.SubmitProposal_footerHolder)}>
        <div className={css(styles.SubmitProposal_stepButtonHolder)}>
          {currentStep > 1 &&
            <Button
              className={css(styles.SubmitProposal_backButton)}
              type='submit'
              onClick={this.decrementStep}
            >
              Back
            </Button>}
          <Button
            className={css(styles.SubmitProposal_continueButton)}
            style={{ marginLeft: currentStep === 1 ? '0px' : '4%' }}
            type='submit'
            onClick={this.incrementStep}
            disabled={!valid}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  renderRFP = (alwaysExpanded = false) => {
    const { isExpanded } = this.state;
    const currentRFP = gon.rfp;

    return (
      <div className={css(styles.SubmitProposal_rfpContainer)}>
        <div className={css(styles.SubmitProposal_company)}>
          <a className={css(styles.SubmitProposal_companyLink)} target="_blank" rel="noopener noreferrer" href={`/company/${currentRFP.company.identifier}`}>
            {currentRFP.company.company_name}
          </a>

          {currentRFP.company.is_partner &&
            <span className={css(styles.SubmitProposal_verifiedIcon)}><img src={verifiedPartnerIcon} /></span>}
        </div>
        <div className={css(styles.SubmitProposal_title)}>{currentRFP.title}</div>
        <div className={css(styles.SubmitProposal_summary)}>{currentRFP.summary}</div>
        {!isExpanded && !alwaysExpanded ? (
          <div
            className={css(styles.SubmitProposal_viewMore)}
            onClick={() => {
              this.setState({ isExpanded: !isExpanded })
            }}
          >
            View More <Icon name="chevron down" />
          </div>
        ) : (
          <>
            {!alwaysExpanded &&
              <div
                className={css(styles.SubmitProposal_viewMore)}
                onClick={() => {
                  this.setState({ isExpanded: !isExpanded })
                }}
              >
                View Less <Icon name="chevron down" />
              </div>}
            <div style={{ marginBottom: '30px' }}>
              <div className={css(styles.SubmitProposal_deadline)}>
                Deadline: {currentRFP.deadline ? moment(currentRFP.deadline).format('MMMM D, YYYY') : "Open-ended"}
              </div>
            </div>

            {currentRFP.why_it_matters && currentRFP.why_it_matters.length > 0 &&
              <div className={css(styles.SubmitProposal_section)}>
                <div className={css(styles.SubmitProposal_sectionHeader)}>OVERVIEW</div>
                {transformText(currentRFP.why_it_matters, css(styles.SubmitProposal_sectionContent), css(styles.SubmitProposal_bulletList), css(styles.SubmitProposal_bulletPoint))}
              </div>
            }

            {currentRFP.in_scope_proposals && currentRFP.in_scope_proposals.length > 0 &&
              <div className={css(styles.SubmitProposal_section)}>
                <div className={css(styles.SubmitProposal_sectionHeader)}>WHAT’S IN SCOPE</div>
                {transformText(currentRFP.in_scope_proposals, css(styles.SubmitProposal_sectionContent), css(styles.SubmitProposal_bulletList), css(styles.SubmitProposal_bulletPoint))}
              </div>
            }

            {currentRFP.out_of_scope_proposals && currentRFP.out_of_scope_proposals.length > 0 &&
              <div className={css(styles.SubmitProposal_section)}>
                <div className={css(styles.SubmitProposal_sectionHeader)}>WHAT'S NOT OF INTEREST</div>
                {transformText(currentRFP.out_of_scope_proposals, css(styles.SubmitProposal_sectionContent), css(styles.SubmitProposal_bulletList), css(styles.SubmitProposal_bulletPoint))}
              </div>
            }

            {currentRFP.available_resources && currentRFP.available_resources.length > 0 &&
              <div className={css(styles.SubmitProposal_section)}>
                <div className={css(styles.SubmitProposal_sectionHeader)}>RESOURCES AVAILABLE TO INVESTIGATORS</div>
                {currentRFP.available_resources.map((resource) => {
                  return (
                    <div key={resource.id} className={css(styles.SubmitProposal_tag)}>
                      {gon.available_resource_mapping[resource.resource_type] || resource.resource_type}
                    </div>
                  );
                })}
                {transformText(currentRFP.additional_resource_details, css(styles.SubmitProposal_sectionContent), css(styles.SubmitProposal_bulletList), css(styles.SubmitProposal_bulletPoint))}
              </div>
            }
          </>
        )}
      </div>
    )
  }

  handleSelect = (data) => {
    const {
      [data.name]: selectedList,
    } = this.state;

    if (!selectedList.includes(data.value)) {
      this.setState({
        [data.name]: selectedList.concat(data.value),
      });
    } else {
      this.setState({
        [data.name]: selectedList.filter((el) => el !== data.value),
      });
    }
  }

  renderStep = () => {
    const {
      currentStep,
      researchHypothesis,
      hypothesisBasis,
      validationProcedure,
      futureValidation,
      isSubmitting,
      selectedPublications,
      selectedPatents,
      selectedFundings,
      noConfidential,
      submittedForPI,
    } = this.state;

    switch (currentStep) {
      case 1:
        return (
          <div className={css(styles.SubmitProposal_stepContainer)}>
            <div className={css(styles.SubmitProposal_entryFields)}>
              <div className={css(styles.SubmitProposal_stepDescription)}>
                What is your lab’s research hypothesis?
              </div>
              <div className={css(styles.SubmitProposal_fieldLabel)}>
                {researchHypothesis.length} of 500 characters
              </div>
              <div>
                <textarea
                  className={css(styles.SubmitProposal_input)}
                  placeholder='Enter your hypothesis...'
                  value={researchHypothesis}
                  onChange={this.handleHypothesis}
                  rows={8}
                />
              </div>
              {this.renderFooter(true)}
              {this.renderRFP()}
            </div>
            <div className={css(styles.SubmitProposal_exampleSection)}>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Example:</b> Thalamic 5HT1A receptors serve as novel targets for Alzheimer’s therapeutics,
                which will act as agonists within the serotonergic pathway.
              </div>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Pro Tip:</b> Your hypothesis should be testable with clearly defined endpoints.
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={css(styles.SubmitProposal_stepContainer)}>
            <div className={css(styles.SubmitProposal_entryFields)}>
              <div className={css(styles.SubmitProposal_stepDescription)}>
                What is the rationale for this hypothesis?
              </div>
              <div className={css(styles.SubmitProposal_fieldLabel)}>
                {hypothesisBasis.length} of 500 characters
              </div>
              <div>
                <textarea
                  className={css(styles.SubmitProposal_input)}
                  placeholder='What is rationale of your hypothesis...'
                  value={hypothesisBasis}
                  onChange={this.handleHypothesisBasis}
                  rows={8}
                />
              </div>
              {this.renderFooter(true)}
              {this.renderRFP()}
            </div>
            <div className={css(styles.SubmitProposal_exampleSection)}>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Example:</b> My lab has assessed the effects of upregulating 5HT1A receptors in a mouse
                model of Alzheimer’s disease, which has shown improved cognition in aspects of memory, attention,
                and decision making.
              </div>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Pro Tip:</b> Include a description of the experiment, significant results, and how those results relate to the current proposal.
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={css(styles.SubmitProposal_stepContainer)}>
            <div className={css(styles.SubmitProposal_entryFields)}>
              <div className={css(styles.SubmitProposal_stepDescription)}>
                How has the hypothesis been validated to date? <span className={css(styles.SubmitProposal_stepDescriptionOptional)}>(optional)</span>
              </div>
              <div className={css(styles.SubmitProposal_fieldLabel)}>
                {validationProcedure.length} of 500 characters
              </div>
              <div>
                <textarea
                  className={css(styles.SubmitProposal_input)}
                  placeholder='Enter your validation procedure...'
                  value={validationProcedure}
                  onChange={this.handleValidationProcedure}
                  rows={8}
                />
              </div>
              {this.renderFooter(true)}
              {this.renderRFP()}
            </div>
            <div className={css(styles.SubmitProposal_exampleSection)}>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Example:</b> A between-subjects study in which a control group (n=12 male AD mice)
                were given a vehicle injection of saline, and the experimental group (n=15 male AD mice)
                were given viral injections of 5HT1A receptors. All animals were matched on cognitive
                performance prior to the injections. Following 3 weeks to permit sufficient expression,
                all animals were re-tested on a series of behavioral tasks to assess cognition.
                A 2x2 ANOVA revealed that the experimental group outperformed the control group on
                all cognitive measures (p &#60; 0.05)
              </div>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Pro Tip:</b> Include the study design, sample size, and statistical results.
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={css(styles.SubmitProposal_stepContainer)}>
            <div className={css(styles.SubmitProposal_entryFields)}>
              <div className={css(styles.SubmitProposal_stepDescription)}>
                What is your research plan?
              </div>
              <div className={css(styles.SubmitProposal_fieldLabel)}>
                {futureValidation.length} of 500 characters
              </div>
              <div>
                <textarea
                  className={css(styles.SubmitProposal_input)}
                  placeholder='Your proposal...'
                  value={futureValidation}
                  onChange={this.handleFutureValidation}
                  rows={8}
                />
              </div>
              {this.renderFooter(true)}
              {this.renderRFP()}
            </div>
            <div className={css(styles.SubmitProposal_exampleSection)}>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Example:</b> To further assess the role of 5HT1A receptors as targets in Alzheimer’s disease, we will create a transgenic mouse line with these receptors overexpressed in selected brain regions. We will test these animals in tasks which measure executive function while performing pharmacological manipulations. This study will take 1 year to complete. We are seeking a partnership which will provide support in animal model development, provision of therapeutics targeting the 5HT pathway, equipment for behavioral testing, and funding for key personnel.
              </div>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Pro Tip:</b> It is not necessary to include your budgetary requirements at this point. If your proposal is of interest, the partner will work with you to ensure you have the resources you need.
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={css(styles.SubmitProposal_stepContainer)}>
            <div className={css(styles.SubmitProposal_entryFields)}>
              <div className={css(styles.SubmitProposal_stepDescription)}>
                Add up to five of your most relevant publications, grants, or patents. <span className={css(styles.SubmitProposal_stepDescriptionOptional)}>(optional)</span>
              </div>
              <ProposalAttachments
                handleSelect={this.handleSelect}
                selectedPublications={selectedPublications}
                selectedPatents={selectedPatents}
                selectedFundings={selectedFundings}
              />
              {this.renderFooter(true)}
            </div>
            <div className={css(styles.SubmitProposal_exampleSection)}>
              <div className={css(styles.SubmitProposal_exampleDescription)}>
                <b>Pro Tip:</b> Make sure to select all relevant publications, fundings, and patents for your proposal to increase your approval chances.
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={css(styles.SubmitProposal_stepContainer)}>
            <div className={css(styles.SubmitProposal_proposalReviewSection)}>
              <div className={css(styles.SubmitProposal_proposalReviewHeader)}>
                Review and Submit
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewDescription)}>
                Review your proposal below before submitting.
                <br />
                Be sure <span><a href={`/profile/${gon.current_user_profile_id}`} target="_blank">your profile</a></span> is up to date.
              </div>
              <div className={css(styles.SubmitProposal_submittingForPISection)}>
                <div className={css(styles.SubmitProposal_proposalReviewSectionContent)}>
                  I’m submitting on behalf of my PI
                </div>
                <Radio
                  className={css(styles.SubmitProposal_submittedForPICheckbox)}
                  label='Yes'
                  name='submittedForPI'
                  value={true}
                  checked={submittedForPI}
                  onChange={this.handleSubmittedForPi}
                />
                <Radio
                  className={css(styles.SubmitProposal_submittedForPICheckbox)}
                  label='No'
                  name='submittedForPI'
                  value={false}
                  checked={!submittedForPI}
                  onChange={this.handleSubmittedForPi}
                />
              </div>
              <div className={css(styles.SubmitProposal_footerHolder)}>
                <div className={css(styles.SubmitProposal_stepButtonHolder)}>
                  <Button
                    className={css(styles.SubmitProposal_finalBackButton)}
                    type='submit'
                    onClick={this.decrementStep}
                    >
                    Back
                  </Button>
                  <Button
                    className={css(styles.SubmitProposal_submitApplicationButton)}
                    type='submit'
                    onClick={(e) => this.handleSubmit(e, false)}
                    disabled={!noConfidential || !researchHypothesis || !futureValidation || !hypothesisBasis}
                    >
                    Submit
                  </Button>
                  <div className={css(styles.SubmitProposal_confidential)}>
                    <Checkbox
                      style={{ height: '17px', margin: 'auto 8px auto 0px' }}
                      name='noConfidential'
                      onChange={this.onConfidentialCheckboxSelect}
                      checked={noConfidential}
                      value={noConfidential}
                      />
                    <div className={css(styles.SubmitProposal_proposalReviewSectionContent)}>
                      The proposal does not include confidential information
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className={css(styles.SubmitProposal_proposalReviewSectionHeader)}>
                Hypothesis
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionContent)}>
                {researchHypothesis && researchHypothesis.length > 0 ? researchHypothesis : 'N/A'}
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionHeader)}>
                Rationale
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionContent)}>
                {hypothesisBasis && hypothesisBasis.length > 0 ? hypothesisBasis : 'N/A'}
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionHeader)}>
                Preliminary Data
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionContent)}>
                {validationProcedure && validationProcedure.length > 0 ? validationProcedure : 'N/A'}
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionHeader)}>
                Plan
              </div>
              <div className={css(styles.SubmitProposal_proposalReviewSectionContent)}>
                {futureValidation && futureValidation.length > 0 ? futureValidation : 'N/A'}
              </div>
            </div>
            <div className={css(styles.SubmitProposal_rfpReviewSection)}>
              <div className={css(styles.SubmitProposal_rfpReviewSectionHeader)}>In response to:</div>
              {this.renderRFP(true)}
            </div>
          </div>
        );
      case 7:
        return (
          <div className={css(styles.SubmitProposal_endingBackground)}>
            <div className={css(styles.SubmitProposal_submissionContainer)}>
              <div className={css(styles.SubmitProposal_applicationSubmitted)}>
                Congratulations! You’ve successfully submitted your proposals
              </div>
              <div className={css(styles.SubmitProposal_finalText)}>
                Here’s what happens next:
              </div>
              {SUBMISSION_BULLETS.map((bullet, i) => {
                return (
                  <div className={css(styles.SubmitProposal_submissionBullet)} key={`bullet-${i}`}>
                    <div className={css(styles.SubmitProposal_numberedBullet)}>
                      {i+1}
                    </div>
                    <div className={css(styles.SubmitProposal_bulletText)}>
                      {bullet}
                    </div>
                  </div>
                );
              })}
              <div className={css(styles.SubmitProposal_finalText)}>
                Responses will be sent within 10 weeks. To check the current status of your proposal, contact hello@halocures.com
              </div>
              <div className={css(styles.SubmitProposal_finalButtonHolder)}>
                <Button
                  className={css(styles.SubmitProposal_goToProfileButton)}
                  onClick={() => { window.location = `/profile/${gon.current_user_profile_id}` }}
                >
                  Review Profile
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  render() {
    const {
      currentStep,
      patentModalOpen,
      publicationModalOpen,
      fundingModalOpen,
    } = this.state;

    return (
      <div>
        <div className={css(styles.SubmitProposal_logoBanner)}>
          {currentStep < TOTAL_STEPS && <div className={css(styles.SubmitProposal_saveContinueButtonHolder)}>
            <div onClick={(e) => this.handleSubmit(e, true)} className={css(styles.SubmitProposal_saveContinueLink)}>
              Save and continue later
            </div>
          </div>}
          <a href="/"><img src={haloLogo} /></a>
        </div>

        <Container className={css(styles.SubmitProposal_container)}>
          {currentStep < TOTAL_STEPS &&
            <Grid>
              <Grid.Row>
                <Grid.Column
                  className={css(
                    styles.SubmitProposal_stepTab,
                    currentStep === 1 && styles.SubmitProposal_activeTab
                  )}
                  onClick={() => { this.setState({ currentStep: 1 })}}
                >
                  Step 1: Hypothesis
                </Grid.Column>
                <Grid.Column
                  className={css(
                    styles.SubmitProposal_stepTab,
                    currentStep === 2 && styles.SubmitProposal_activeTab
                  )}
                  onClick={() => { this.setState({ currentStep: 2 })}}
                >
                  Step 2: Rationale
                </Grid.Column>
                <Grid.Column
                  className={css(
                    styles.SubmitProposal_stepTab,
                    currentStep === 3 && styles.SubmitProposal_activeTab
                  )}
                  onClick={() => { this.setState({ currentStep: 3 })}}
                >
                  Step 3: Preliminary Data
                </Grid.Column>
                <Grid.Column
                  className={css(
                    styles.SubmitProposal_stepTab,
                    currentStep === 4 && styles.SubmitProposal_activeTab
                  )}
                  onClick={() => { this.setState({ currentStep: 4 })}}
                >
                  Step 4: Plan
                </Grid.Column>
                <Grid.Column
                  className={css(
                    styles.SubmitProposal_stepTab,
                    currentStep === 5 && styles.SubmitProposal_activeTab
                  )}
                  onClick={() => { this.setState({ currentStep: 5 })}}
                >
                  Step 5: Materials
                </Grid.Column>
              </Grid.Row>
            </Grid>}
          {this.renderStep()}
        </Container>
      </div>
    );
  }
}

export default SubmitProposal;
