import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { intersection } from 'lodash';
import { css, StyleSheet } from 'aphrodite';
import { Button, Grid } from "semantic-ui-react";

import { COLORS } from '../../../../constants';
import {
  saveRFP as saveRFPAction,
  unsaveRFP as unsaveRFPAction,
  initializeSaveRFPs as initializeSaveRFPsAction,
  updateResultList as updateResultListAction,
} from '../../actions/defaultActions';
import ResultRow from '../ResultRow';

const styles = StyleSheet.create({
  ResultsList_noResultsText: {
    textAlign: 'center',
    fontSize: '14px',
  },
  ResultsList_resultRow: {
    textDecoration: 'none',
  },
});

class ResultsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredResults: [],
    };
  }

  componentWillMount = () => {
    const {
      initializeSaveRFPs,
    } = this.props;

    initializeSaveRFPs(gon.saved_rfps || {});

    this.filterResults();
  }

  filterResults = () => {
    const {
      filters: { researchArea, innovationType },
      savedRFPs,
      searchTerm,
      onlySaved,
      onlyPartners,
      company,
    } = this.props;

    const filteredResults = gon.rfp_results.filter((result) => {
      let hasResearchArea = true;
      if (researchArea && researchArea.length > 0) {
        hasResearchArea = researchArea.map(ra => gon.areas_of_expertise_mapping[ra]).includes(result.therapeutic_area);
      }

      let hasInnovationType = true;
      if (innovationType && innovationType.length > 0) {
        hasInnovationType = intersection(
          innovationType.map(it => gon.innovation_type_mapping[it]),
          result.innovation_types.map(it => it.value)
        ).length > 0;
      }

      let matchesTitle = true;
      const re = new RegExp(_.escapeRegExp(searchTerm), 'i');
      const isMatch = result => re.test(result.title);
      if (searchTerm.length > 0) {
        matchesTitle = isMatch(result);
      }

      let isSaved = true;
      if (onlySaved) {
        isSaved = savedRFPs[result.id] ? true : false;
      }

      let isPartner = true;
      if (onlyPartners) {
        isPartner = result.company.is_partner;
      }

      let isCompany = true;
      if (company) {
        isCompany = result.company.id === company.id;
      }

      return hasResearchArea && hasInnovationType && matchesTitle && isSaved && isPartner && isCompany;
    });

    this.setState({
      filteredResults,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      resultList,
      updateResultList,
    } = this.props;

    if (prevProps !== this.props) {
      this.filterResults();
    }
    if (prevState.filteredResults != this.state.filteredResults &&
      (resultList.length !== this.state.filteredResults.length)) {
      updateResultList(this.state.filteredResults);
    }
  }

  render() {
    const {
      isUpdatingSaveRFP,
      savedRFPs,
      saveRFP,
      unsaveRFP,
      resultList,
    } = this.props;

    const { filteredResults } = this.state;

    return (
      <div>
        {filteredResults.length === 0 &&
          <div className={css(styles.ResultsList_noResultsText)}>
            No results match these filters
          </div>}
        {
          filteredResults.map((rfp) => {
            return (
              <Link
                key={`rfp-${rfp.id}`}
                to={`/research/${rfp.research_area}/${rfp.identifier}`}
                className={css(styles.ResultsList_resultRow)}
              >
                <ResultRow
                  rfpId={rfp.id}
                  title={rfp.title}
                  company={rfp.company.company_name}
                  isPartner={rfp.company.is_partner}
                  summary={rfp.summary}
                  therapeuticArea={rfp.therapeutic_area}
                  innovationTypes={rfp.innovation_types.map(innovType => innovType.value)}
                  saveRFP={saveRFP}
                  unsaveRFP={unsaveRFP}
                  isUpdatingSaveRFP={isUpdatingSaveRFP[rfp.id]}
                  isSaved={savedRFPs[rfp.id]}
                />
              </Link>
            );
          })
        }
      </div>
    );
  }
}

ResultsList.propTypes = {
  onlySaved: PropTypes.bool,
  onlyPartners: PropTypes.bool,
  filters: PropTypes.object,
  searchTerm: PropTypes.string,
  isUpdatingSaveRFP: PropTypes.object,
  savedRFPs: PropTypes.object,
  saveRFP: PropTypes.func,
  unsaveRFP: PropTypes.func,
  updateResultList: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    filters: state.defaultReducer.filters,
    searchTerm: state.defaultReducer.searchTerm,
    isUpdatingSaveRFP: state.defaultReducer.isUpdatingSaveRFP,
    savedRFPs: state.defaultReducer.savedRFPs,
    resultList: state.defaultReducer.resultList,
  };
};

const mapDispatchToProps = {
  saveRFP: saveRFPAction,
  unsaveRFP: unsaveRFPAction,
  initializeSaveRFPs: initializeSaveRFPsAction,
  updateResultList: updateResultListAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
