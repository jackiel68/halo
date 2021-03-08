import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, StyleSheet } from 'aphrodite';
import moment from 'moment';
import { Container, Grid, Tab, Menu, Button, Icon, Input, TextArea } from 'semantic-ui-react';
import { styles as modalStyles } from '../Modal'

import { authenticityToken } from '../../utils/requests';
import { COLORS } from '../../../../constants';
import { getUrlParameter } from '../../utils/requests';
import {
  toggleFundingModal as toggleFundingModalAction,
  togglePublicationModal as togglePublicationModalAction,
  togglePatentModal as togglePatentModalAction,
  fetchUser as fetchUserAction,
  setCurrentUser as setCurrentUserAction,
  fetchPublications as fetchPublicationsAction,
  fetchPatents as fetchPatentsAction,
  fetchFundings as fetchFundingsAction,
} from '../../actions/profileActions';
import NewFundingModal from '../NewFundingModal';
import NewPublicationModal from '../NewPublicationModal';
import NewPatentModal from '../NewPatentModal';
import EmbeddedTextInput from '../EmbeddedTextInput';
import ProfileList from './ProfileList';


const styles = StyleSheet.create({
  ProfilePage_mainPanes: {
    marginTop: 0,
  },
  ProfilePage_menuItem: {
    fontSize: '14px',
    paddingLeft: '40px',
    paddingRight: '40px',
  },
  ProfilePage_tabMenu: {

  },
  ProfilePage_input: {
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
  ProfilePage_sectionHeader: {
    color: COLORS.lightBlack,
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '80px',
    marginBottom: '20px',
    display: 'inline-block',
  },
  ProfilePage_addButton: {
    fontSize: '14px',
    padding: '10px 35px',
    borderRadius: '4px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
  },
  ProfilePage_leftAlign: {
    marginTop: '40px',
    textAlign: 'left',
  },
  ProfilePage_rightAlign: {
    marginTop: '30px',
    textAlign: 'right',
  },
  ProfilePage_editButton: {
    color: COLORS.gray,
    marginLeft: '10px',
    fontSize: '14px',
    display: 'inline-block',
    cursor: 'pointer',
  },
  ProfilePage_importPublicationInput: {
    display: 'inline-block',
    width: '80%',
  },
  ProfilePage_importPublicationButton: {
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
  ProfilePage_headline: {
    fontSize: '18px',
    color: COLORS.lightBlack,
    height: '50px'
  },
  ProfilePage_about: {
    fontSize: '14px',
    height: '92px',
    marginTop: '-10px'
  },
  ProfilePage_headlineUpdateStatus: {
    fontSize: '12px',
    fontWeight: 'light',
    verticalAlign: 'middle',
    lineHeight: '70px'
  },
  ProfilePage_aboutUpdateStatus: {
    fontSize: '12px',
    fontWeight: 'light',
    verticalAlign: 'middle',
    lineHeight: '50px'
  },
  ProfilePage_overviewInputCol: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: '-7px',
    marginBottom: '1em'
  },
  ProfilePage_overview: {
    marginTop: '17px'
  },
  ProfilePage_disabledEmbeddedTextInput: {
    ':hover' : {
      borderColor: COLORS.white,
    },
  },
  ProfilePage_awardTag: {
    color: COLORS.gray,
    fontSize: '10px',
    fontWeight: 'bold',
    paddingLeft: '1rem',
    position: 'relative',
    top: '16px',
    ':nth-child(1n) > i': {
      display: 'inline-block',
      height: '15px',
      width: '15px',
      position: 'relative',
      top: '2px',
      left: '2px',
    }
  }
});

class ProfilePage extends PureComponent {
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
      fetchUser,
      fetchPublications,
      fetchPatents,
      fetchFundings,
      match,
    } = this.props;

    const pathId = match.params.id.split('-');
    const currentUserId = pathId[pathId.length - 1];

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

  saveUserProfileInfo = async (fieldName, value) => {
    const {
      currentUser,
      setCurrentUser
    } = this.props;

    this.setState({
      [`${fieldName}Updating`]: true,
      [`${fieldName}UpdateError`]: false
    });

    const formData = new FormData();
    formData.append(fieldName, value);
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
          [`${fieldName}UpdateError`]: true,
          [`${fieldName}Updating`]: false,
        });
      } else {
        setCurrentUser(responseJson.user)
        this.setState({
          [`${fieldName}Updating`]: false,
          [`${fieldName}UpdateSuccess`]: true,
        });
        setTimeout(() => this.setState({ [`${fieldName}UpdateSuccess`]: null }), 2500)
      }
    } catch(err) {
      this.setState({ [`${fieldName}UpdateError`]: true });
    }
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
      currentUser
    } = this.props;
    const {
      importingPublication,
      publicationURL,
    } = this.state;

    const panes = [];
    const pathId = match.params.id.split('-');
    const currentUserId = pathId[pathId.length - 1];
    const isUser = gon.current_user && String(gon.current_user.id) === currentUserId;
    const isPublic = getUrlParameter('public') === 'true';

    if (publications.length > 0 || (isUser && !isPublic)) {
      panes.push({
        menuItem: <Menu.Item className={css(styles.ProfilePage_menuItem)} onClick={() => this.handleTabClick(0)} key="publications">Publications ({publications.length})</Menu.Item>,
        render: () => {
          return (
            <div>
              {isUser && !isPublic && (
                <div className={css(styles.ProfilePage_rightAlign)}>
                  <div className={css(styles.ProfilePage_importPublicationInput)}>
                    <Input
                      className={css(styles.ProfilePage_input)}
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
                    className={css(styles.ProfilePage_importPublicationButton)}
                    disabled={importingPublication || !publicationURL || publicationURL.length === 0}
                    onClick={() => this.importURL(publicationURL)}
                  >
                    Add
                  </Button>
                </div>)}
              <ProfileList
                editMethod={(id) => togglePublicationModal({ open: true, currentPublicationId: id })}
                isUser={isUser}
                itemName='Publications'
                items={publications.map((p) => {
                  return {
                    header: p.title,
                    body: p.abstract,
                    url: p.url,
                    id: p.id,
                    footerElements: [p.date ? moment(p.date).format('MMM YYYY') : 'No Date', p.publication_name],
                  };
                })}
              />
            </div>
          );
        },
      });
    }

    if (fundings.length > 0 || (isUser && !isPublic)) {
      panes.push({
        menuItem: <Menu.Item className={css(styles.ProfilePage_menuItem)} onClick={() => this.handleTabClick(1)} key="saved">Funding ({fundings.length})</Menu.Item>,
        render: () => {
          // Create our number formatter.
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });

          return (
            <div>
              {isUser && !isPublic && (
                <div className={css(styles.ProfilePage_leftAlign)}>
                  <Button className={css(styles.ProfilePage_addButton)} onClick={() => toggleFundingModal(true)}>Add Funding</Button>
                </div>)}
              <ProfileList
                editMethod={(id) => toggleFundingModal({ open: true, currentFundingId: id })}
                isUser={isUser}
                itemName='Fundings'
                items={fundings.map((f) => {
                  const sponsorName = _.keys(f.sponsor).filter((key) => key.match('name'));
                  const startDate = f.date ? moment(f.date).format('MMM YYYY') : 'No Date';
                  const endDate = f.end_date ? moment(f.end_date).format('MMM YYYY') : 'Present';
                  const dateText = f.date ? startDate + ' - ' + endDate : 'No Date';
                  const amountEl = { text: `${formatter.format(Number(f.amount)).split('.')[0]}`, width: 3 };
                  const sponsorText = (f.other_sponsor || (f.sponsor || {})[sponsorName]) + " " + (f.grant_type || '');

                  const awardRecipientTag = (
                    <div className={css(styles.ProfilePage_awardTag)}>
                      Award Recipient
                      <i className='icon-medal' />
                    </div>
                  );

                  return {
                    header: f.title,
                    body: f.description,
                    url: f.url,
                    id: f.id,
                    tagElement: f.award_recipient_id === currentUser.id ? awardRecipientTag : '',
                    footerElements: [
                      { width: 6, text: dateText },
                      amountEl,
                      { width: 7, text: sponsorText }
                    ]
                  };
                })}
              />
            </div>
          );
        }
      });
    }

    if (patents.length > 0 || (isUser && !isPublic)) {
      panes.push({
        menuItem: <Menu.Item className={css(styles.ProfilePage_menuItem)} onClick={() => this.handleTabClick(2)} key="partners">Patents ({patents.length})</Menu.Item>,
        render: () => {
          return (
            <div>
              {isUser && !isPublic && (
                <div className={css(styles.ProfilePage_leftAlign)}>
                  <Button className={css(styles.ProfilePage_addButton)} onClick={() => togglePatentModal({ open: true })}>Add Patent</Button>
                </div>)}
              <ProfileList
                isUser={isUser}
                editMethod={(id) => togglePatentModal({ open: true, currentPatentId: id })}
                itemName='Patents'
                items={patents.map((p) => {
                  const patentStatus = gon.patent_statuses.find(ps => ps.key === p.status);
                  const statusText = 'Status: ' + (patentStatus ? patentStatus.text : 'None');
                  const patentFilingDate = (p.filing_date ? 'Filing Date: ' + moment.utc(p.filing_date).format('MMM DD, YYYY') : 'No Date');
                  return {
                    header: p.title,
                    body: p.abstract,
                    url: p.url,
                    id: p.id,
                    footerElements: [
                      { text: patentFilingDate, width: 6 },
                      { text: statusText, width: 10 }
                    ]
                  };
                })}
              />
            </div>
          );
        }
      });
    }

    return panes;
  };

  renderUpdateStatus = (fieldName) => {
    let message;
    if (this.state[fieldName + 'UpdateError']) {
        message = 'failed to save'
    } else if (this.state[fieldName + 'Updating']) {
        message = 'saving...'
    } else if (this.state[fieldName + 'UpdateSuccess']) {
        message = 'autosaved'
    }

    return <span className={css(styles[`ProfilePage_${fieldName}UpdateStatus`])}>{message}</span>;
  }

  renderHeadline = () => {
    const {
      currentUser
    } = this.props;

    const isPublic = getUrlParameter('public') === 'true';
    const isUser = gon.current_user && gon.current_user.id === currentUser.id;
    const canEdit = isUser && !isPublic && currentUser;
    const inputClassName = css(
      styles.ProfilePage_headline,
      !canEdit && styles.ProfilePage_disabledEmbeddedTextInput
    )

    const headline = currentUser && currentUser.profile_info && currentUser.profile_info.headline ? currentUser.profile_info.headline : undefined;
    return (
      <Grid>
        <Grid.Column width={12}>
          <EmbeddedTextInput
            className={inputClassName}
            disabled={!canEdit}
            maxLength="75"
            defaultValue={headline}
            placeholder='Write a headline about your research'
            onBlur={(e) => this.saveUserProfileInfo('headline', e.currentTarget.value)}
          />
        </Grid.Column>
        {this.renderUpdateStatus('headline')}
      </Grid>
    );
  }

  renderAbout = () => {
    const {
      currentUser
    } = this.props;

    const isPublic = getUrlParameter('public') === 'true';
    const isUser = gon.current_user && gon.current_user.id === currentUser.id;
    const canEdit = isUser && !isPublic && currentUser;
    const inputClassName = css(
      styles.ProfilePage_about,
      !canEdit && styles.ProfilePage_disabledEmbeddedTextInput
    )
    const about = currentUser && currentUser.profile_info && currentUser.profile_info.about ? currentUser.profile_info.about : '';

    return (
      <Grid>
        <Grid.Column width={12} className={css(styles.ProfilePage_overviewInputCol)}>
          <EmbeddedTextInput
            className={inputClassName}
            disabled={!canEdit}
            maxLength="300"
            placeholder='Provide a short summary'
            defaultValue={about}
            onBlur={(e) => this.saveUserProfileInfo('about', e.currentTarget.value)}
          />
        </Grid.Column>
        {this.renderUpdateStatus('about')}
      </Grid>
    );
  }

  render() {
    const {
      currentUser,
      match,
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

    const pathId = match.params.id.split('-');
    const currentUserId = pathId[pathId.length - 1];
    const isUser = gon.current_user && String(gon.current_user.id) === currentUserId;
    const isPublic = getUrlParameter('public') === 'true';
    const hasAbout = (currentUser.profile_info && currentUser.profile_info.about && currentUser.profile_info.about.trim().length > 0);
    const hasHeadline = (currentUser.profile_info && currentUser.profile_info.headline && currentUser.profile_info.headline.trim().length > 0);

    return (
      <Container>
        <NewFundingModal title="Add Grants" currentUserId={currentUser.id} />
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
        />
        <NewPatentModal currentUserId={currentUser.id} />
        {((isUser && !isPublic) || (currentUser && currentUser.profile_info && hasAbout && hasHeadline)) && (
          <div className={css(styles.ProfilePage_overview)}>
            {this.renderHeadline()}
            {this.renderAbout()}
          </div>
        )}
        <div className={css(styles.ProfilePage_mainPanes)}>
          <Grid>
            <Grid.Column width={12}>
              <Tab className={css(styles.ProfilePage_tabMenu)} activeIndex={activeTabIndex} menu={{ secondary: true, pointing: true }} panes={this.getPanes()} />
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    );
  }
}

ProfilePage.defaultProps = {
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
  setCurrentUser: setCurrentUserAction,
  fetchPublications: fetchPublicationsAction,
  fetchPatents: fetchPatentsAction,
  fetchFundings: fetchFundingsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfilePage);
