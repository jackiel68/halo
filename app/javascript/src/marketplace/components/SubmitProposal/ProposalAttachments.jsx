import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import moment from 'moment';
import { Container, Grid, Tab, Menu, Button, Icon, Input } from 'semantic-ui-react';

import { COLORS } from '../../../../constants';
import { getUrlParameter } from '../../utils/requests';
import {
  toggleFundingModal as toggleFundingModalAction,
  togglePublicationModal as togglePublicationModalAction,
  togglePatentModal as togglePatentModalAction,
  fetchUser as fetchUserAction,
  fetchPublications as fetchPublicationsAction,
  fetchPatents as fetchPatentsAction,
  fetchFundings as fetchFundingsAction,
} from '../../actions/profileActions';
import NewFundingModal from '../NewFundingModal';
import NewPublicationModal from '../NewPublicationModal';
import NewPatentModal from '../NewPatentModal';
import ProfileList from '../ProfilePage/ProfileList';
import AboutEditModal from '../ProfilePage/AboutEditModal';

const styles = StyleSheet.create({
  ProposalAttachments_mainPanes: {
    marginTop: '35px',
    textAlign: 'left',
  },
  ProposalAttachments_menuItem: {
    fontSize: '14px',
    paddingLeft: '40px',
    paddingRight: '40px',
  },
  ProposalAttachments_tabMenu: {

  },
  ProposalAttachments_input: {
    width: '100%',
    margin: 'auto',
    padding: '10px',
    height: '50px',
    fontSize: '14px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderColor: COLORS.gray,
    borderRadius: '5px',
    borderWidth: '1px',
  },
  ProposalAttachments_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '80px',
    marginBottom: '20px',
    display: 'inline-block',
  },
  ProposalAttachments_aboutText: {
    fontSize: '14px',
    marginBottom: '60px',
    color: COLORS.lightBlack,
    width: '75%',
  },
  ProposalAttachments_addButton: {
    fontSize: '14px',
    padding: '10px 35px',
    borderRadius: '4px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
  },
  ProposalAttachments_leftAlign: {
    marginTop: '40px',
    textAlign: 'left',
  },
  ProposalAttachments_rightAlign: {
    marginTop: '30px',
    textAlign: 'right',
  },
  ProposalAttachments_editButton: {
    color: COLORS.yellow,
    marginLeft: '10px',
    fontSize: '14px',
    display: 'inline-block',
    cursor: 'pointer',
  },
  ProposalAttachments_inputDescriptionText: {
    fontSize: '12px',
    color: COLORS.lightBlack,
    marginBottom: '-10px',
    marginTop: '20px',
    textAlign: 'left',
  },
  ProposalAttachments_scrollingSection: {
    marginTop: '10px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  ProposalAttachments_importPublicationInput: {
    display: 'inline-block',
    width: '80%',
  },
  ProposalAttachments_importPublicationButton: {
    fontSize: '14px',
    borderRadius: '4px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    width: '20%',
    display: 'inline-block',
    margin: '0',
    padding: '19px 0 19px',
  },
});

class ProposalAttachments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      aboutEdit: false,
      aboutEditModalOpen: false,
      importingPublication: false,
      publicationTitle: undefined,
      publicationName: undefined,
      publicationURL: undefined,
      publicationAbstract: undefined,
      publicationYear: undefined,
      publicationMonth: undefined,
    };
  }

  async componentDidMount() {
    const {
      currentUser,
      fetchUser,
      fetchPublications,
      fetchPatents,
      fetchFundings,
      match,
    } = this.props;

    const currentUserId = currentUser.id || (gon.current_user || {}).id;

    await fetchUser(currentUserId);
    await fetchPublications(currentUserId);
    await fetchPatents(currentUserId);
    await fetchFundings(currentUserId);

    window.scrollTo(0, 0);
  }

  handleTabClick = (index) => {
    this.setState({ activeTabIndex: index });
  }

  handleChange = (e, attr) => {
    this.setState({ [attr]: e.target.value });
  };

  convertMonthName = (month) => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
  }

  importURL = async (url) => {
    const {
      togglePublicationModal
    } = this.props;

    this.setState({
      importingPublication: true,
    });

    const xmlParams = "?report=xml&format=text";

    let normalUrl;
    if (!url.endsWith(xmlParams)) {
      normalUrl = url;
      url += xmlParams;
    } else {
      normalUrl = url.split(xmlParams).join('');
    }

    if (!url.startsWith('http')) {
      url = 'https://' + url;
      normalUrl = 'https://' + normalUrl;
    }

    try {
      const response = await fetch(`/import_pubmed?url=${encodeURI(url)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      const responseJson = await response.json();

      this.setState({
        publicationTitle: responseJson.article_title || responseJson.book_title,
        publicationName: responseJson.journal_title || responseJson.publisher_name,
        publicationURL: normalUrl,
        publicationAbstract: responseJson.abstract,
      });

      if (responseJson.pubdate_year) {
        this.setState({
          publicationYear: responseJson.pubdate_year,
          publicationMonth: String(this.convertMonthName(responseJson.pubdate_month)),
        });
      }

      togglePublicationModal(true)
    } catch (err) {
      console.log(err);
    }

    this.setState({
      importingPublication: false,
    });
  }

  getPanes = () => {
    const {
      fundings,
      publications,
      patents,
      match,
      togglePublicationModal,
      togglePatentModal,
      toggleFundingModal,
      handleSelect,
      selectedPublications,
      selectedFundings,
      selectedPatents,
    } = this.props;
    const {
      importingPublication,
      publicationURL,
    } = this.state;

    const panes = [];
    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalAttachments_menuItem)} onClick={() => this.handleTabClick(0)} key="publications">Publications ({publications.length})</Menu.Item>,
      render: () => {
        return (
          <div>
            {publications.length > 0 && <div className={css(styles.ProposalAttachments_inputDescriptionText)}>Select a publication from your profile or add a new publication below.</div>}
            <div className={css(styles.ProposalAttachments_rightAlign)}>
              <div className={css(styles.ProposalAttachments_importPublicationInput)}>
                <Input
                  className={css(styles.ProposalAttachments_input)}
                  transparent
                  fluid
                  name='email'
                  icon="linkify"
                  type="text"
                  value={publicationURL || ''}
                  placeholder='Paste publication link (e.g. https://www.ncbi.nlm.nih.gov/pubmed/31254486)'
                  onChange={(e) => this.handleChange(e, 'publicationURL')}
                />
              </div>
              <Button
                className={css(styles.ProposalAttachments_importPublicationButton)}
                disabled={importingPublication || !publicationURL || publicationURL.length === 0}
                onClick={() => this.importURL(publicationURL)}
              >
                Add
              </Button>
            </div>
            <div className={css(styles.ProposalAttachments_scrollingSection)}>
              <ProfileList
                isUser
                itemName='Publications'
                items={publications.map((p) => {
                  return {
                    header: p.title,
                    body: p.abstract,
                    url: p.url,
                    id: p.id,
                    footerElements: [p.date ? moment(p.date).format('MMMM YYYY') : 'No Date', p.publication_name],
                  };
                })}
                selectGroup={"selectedPublications"}
                isSelectable
                onSelect={(e, data) => handleSelect(data)}
                selected={selectedPublications}
              />
            </div>
          </div>
        );
      },
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalAttachments_menuItem)} onClick={() => this.handleTabClick(1)} key="saved">Funding ({fundings.length})</Menu.Item>,
      render: () => {
        // Create our number formatter.
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });

        return (
          <div>
            <div className={css(styles.ProposalAttachments_rightAlign)}>
              <Button className={css(styles.ProposalAttachments_addButton)} onClick={() => toggleFundingModal(true)}>Add Funding</Button>
            </div>
            <div className={css(styles.ProposalAttachments_scrollingSection)}>
              <ProfileList
                isUser
                itemName='Fundings'
                items={fundings.map((f) => {
                  let header;
                  if (f.sponsor) {
                    if (f.sponsor_type === 'foundation') {
                      header = `${f.sponsor.foundation_name} - ${f.title}`;
                    } else if (f.sponsor_type === 'government') {
                      header = `${f.sponsor.org_name} - ${f.title}`;
                    } else {
                      header = `${f.sponsor.company_name} - ${f.title}`;
                    }
                  } else {
                    header = f.title;
                  }
                  return {
                    header,
                    body: f.description,
                    url: f.url,
                    id: f.id,
                    footerElements: [f.date ? moment(f.date).format('MMMM YYYY') : 'No Date', `${formatter.format(Number(f.amount)).split('.')[0]}`, (f.sponsor || {}).company_name],
                  };
                })}
                selectGroup={"selectedFundings"}
                isSelectable
                onSelect={(e, data) => handleSelect(data)}
                selected={selectedFundings}
              />
            </div>
          </div>
        );
      }
    });

    panes.push({
      menuItem: <Menu.Item className={css(styles.ProposalAttachments_menuItem)} onClick={() => this.handleTabClick(2)} key="partners">Patents ({patents.length})</Menu.Item>,
      render: () => {
        return (
          <div>
            <div className={css(styles.ProposalAttachments_rightAlign)}>
              <Button className={css(styles.ProposalAttachments_addButton)} onClick={() => togglePatentModal({ open: true })}>Add Patent</Button>
            </div>
            <div className={css(styles.ProposalAttachments_scrollingSection)}>
              <ProfileList
                isUser
                itemName='Patents'
                items={patents.map((p) => {
                  const patentStatus = gon.patent_statuses.find(ps => ps.key === p.status);
                  const statusText = 'Status: ' + (patentStatus ? patentStatus.text : 'None');
                  const patentFilingDate = (p.filing_date ? 'Filing Date: ' + moment.utc(p.filing_date).format('MMMM DD, YYYY') : 'No Date');
                  return {
                    header: p.title,
                    body: p.abstract,
                    url: p.url,
                    id: p.id,
                    footerElements: [patentFilingDate, null, statusText]
                  };
                })}
                selectGroup={"selectedPatents"}
                isSelectable
                onSelect={(e, data) => handleSelect(data)}
                selected={selectedPatents}
              />
            </div>
          </div>
        );
      }
    });

    return panes;
  };

  render() {
    const {
      currentUser,
      match,
      handleSelect,
    } = this.props;
    const {
      activeTabIndex,
      aboutEdit,
      aboutEditModalOpen,
      publicationTitle,
      publicationName,
      publicationURL,
      publicationAbstract,
      publicationYear,
      publicationMonth,
    } = this.state;

    const currentUserId = currentUser.id;

    return (
      <div>
        <AboutEditModal
          open={aboutEditModalOpen}
          closeModal={() => this.setState({ aboutEditModalOpen: false })}
          userId={currentUser.id}
          text={currentUser && currentUser.profile_info ? currentUser.profile_info.about : undefined}
        />
        <NewFundingModal title="Add Funding" currentUserId={currentUser.id} />
        <NewPublicationModal
          title="Confirm Publication"
          currentUserId={currentUser.id}
          publicationTitle={publicationTitle}
          publicationName={publicationName}
          publicationURL={publicationURL}
          publicationAbstract={publicationAbstract}
          publicationMonth={publicationMonth}
          publicationYear={publicationYear}
          clearUrl={() => {
            this.setState({ publicationURL: '' })
          }}
          afterAddAction={(publicationId) => {
            handleSelect({ name: 'selectedPublications', value: Number(publicationId) });
          }}
        />
        <NewPatentModal currentUserId={currentUser.id} />
        <div className={css(styles.ProposalAttachments_mainPanes)}>
          <Grid>
            <Grid.Column width={16}>
              <Tab className={css(styles.ProposalAttachments_tabMenu)} activeIndex={activeTabIndex} menu={{ secondary: true, pointing: true }} panes={this.getPanes()} />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

ProposalAttachments.defaultProps = {
  fundings: [],
  publications: [],
  patents: [],
  currentUser: {},
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.profiles.currentUser,
    fundings: state.profiles.fundings,
    publications: state.profiles.publications,
    patents: state.profiles.patents,
  };
};

const mapDispatchToProps = {
  toggleFundingModal: toggleFundingModalAction,
  togglePublicationModal: togglePublicationModalAction,
  togglePatentModal: togglePatentModalAction,
  fetchUser: fetchUserAction,
  fetchPublications: fetchPublicationsAction,
  fetchPatents: fetchPatentsAction,
  fetchFundings: fetchFundingsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProposalAttachments);
