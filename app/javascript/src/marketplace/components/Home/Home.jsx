import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import { Container, Tab, Menu, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { COLORS } from '../../../../constants';
import SearchBar from '../SearchBar';
import ResultsList from '../ResultsList';

const styles = StyleSheet.create({
  Home_header: {
    fontSize: '24px',
    fontWeight: 600,
    color: COLORS.lightBlack,
  },
  Home_subheader: {
    fontSize: '13px',
    color: COLORS.lightGray,
    marginTop: '5px',
    marginBottom: '20px',
  },
  Home_mainPanes: {
    marginTop: '35px',
  },
  Home_menuItem: {
    fontSize: '14px',
    paddingLeft: '40px',
    paddingRight: '40px',
  },
});

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
    };
  }

  renderRFPResults = (options) => {
    return (
      <Tab.Pane>
        <ResultsList onlySaved={options.onlySaved} onlyPartners={options.onlyPartners} />
      </Tab.Pane>
    );
  }

  handleTabClick = (index) => {
    this.setState({ activeTabIndex: index });
  }

  getPanes = () => {
    const panes =
      [
        {
          menuItem: <Menu.Item className={css(styles.Home_menuItem)} onClick={() => this.handleTabClick(0)} key="all">All</Menu.Item>,
          render: () => this.renderRFPResults({ onlySaved: false, onlyPartners: false })
        },
        {
          menuItem: <Menu.Item className={css(styles.Home_menuItem)} onClick={() => this.handleTabClick(1)} key="partners">Partners</Menu.Item>,
          render: () => this.renderRFPResults({ onlySaved: false, onlyPartners: true })
        },
      ];
    if (gon.logged_in) {
      panes.push({
        menuItem: <Menu.Item className={css(styles.Home_menuItem)} onClick={() => this.handleTabClick(2)} key="saved">Saved</Menu.Item>,
        render: () => this.renderRFPResults({ onlySaved: true, onlyPartners: false })
      });
    }
    return panes;
  };

  render() {
    const { activeTabIndex } = this.state;
    const { resultList } = this.props;

    return (
      <Container>
        <div className={css(styles.Home_header)}>Find Industry Collaborations</div>
        <div className={css(styles.Home_subheader)}>{resultList.length} Industry Collaborations</div>
        <div>
          <SearchBar />
        </div>
        <div className={css(styles.Home_mainPanes)}>
          <Grid>
            <Grid.Column width={12}>
              <Tab className={css(styles.Home_tabMenu)} activeIndex={activeTabIndex} menu={{ secondary: true, pointing: true }} panes={this.getPanes()} />
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    );
  }
}

Home.defaultProps = {
  name: 'Home',
};

Home.propTypes = {
  name: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    resultList: state.defaultReducer.resultList,
  };
};

export default connect(
  mapStateToProps,
)(Home);
