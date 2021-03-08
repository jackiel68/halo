import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import { Button, Container, Search, Grid, Header, Segment, Label, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { searchTerm as searchTermAction } from '../../actions/defaultActions';

const styles = StyleSheet.create({
  SearchBar_searchbar: {
    width: '100%',
    fontSize: '14px',
  },
});

const resultRenderer = ({ id, title, company }) => <div key={`result-${id}`}>{company}: {title}</div>

resultRenderer.propTypes = {
  title: PropTypes.string,
}

class SearchBar extends PureComponent {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      isLoading: false,
      results: gon.rfp_results.map(result => this.extractRFPResult(result)),
      value: ''
    });
  }

  extractRFPResult = (result) => {
    return {
      key: `rfp-${result.id}`,
      title: result.title,
      company: (result.company || {}).company_name,
    };
  }

  handleResultSelect = (e, { result }) => {
    const { searchTerm, onSelect } = this.props;
    this.setState({ value: result.title });
    onSelect ? onSelect(result.id) : searchTerm(result.title);
  };

  handleSearchChange = (e, { value }) => {
    const { searchTerm } = this.props;
    this.setState({ isLoading: true, value });

    if (value.length === 0) {
      this.resetComponent();
      searchTerm('');
    }

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title) || re.test(result.company.company_name);

      this.setState({
        isLoading: false,
        results: _.filter(gon.rfp_results, isMatch).map(result => this.extractRFPResult(result)),
      });
    }, 300);
  };

  handleSearch = () => {
    const { value } = this.state;
    const { searchTerm } = this.props;
  }

  render() {
    const { isLoading, value, results } = this.state;
    const { width } = this.props;

    return (
      <Grid>
        <Grid.Column width={width}>
          <Form onSubmit={this.handleSearch}>
            <Search
              className={"searchbar"}
              style={{ fontSize: '14px' }}
              fluid
              input={{ icon: 'search', iconPosition: 'left', input: 'text' }}
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
                trailing: true,
              })}
              results={results}
              placeholder="Find opportunities..."
              resultRenderer={resultRenderer}
              value={value}
            />
            <input type="submit" style={{ visibility: 'hidden', position: 'absolute' }} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

SearchBar.propTypes = {
  width: PropTypes.number,
  onSelect: PropTypes.func,
};

SearchBar.defaultProps = {
  width: 12,
};

const mapDispatchToProps = {
  searchTerm: searchTermAction,
};

export default connect(
  null,
  mapDispatchToProps
)(SearchBar);
