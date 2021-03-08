import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { intersection } from 'lodash';
import { css, StyleSheet } from 'aphrodite';

import { COLORS } from '../../../../constants';
import ProfileRow from './ProfileRow';
import emptyState from '../../../../images/halo-empty-state.png';
import {
  authenticityToken,
} from '../../utils/requests';

const styles = StyleSheet.create({
  ProfileList_noResultsText: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '30px',
  },
  ProfileList_resultRow: {
    textDecoration: 'none',
  },
  ProfileList_addPrompt: {
    fontSize: '21px',
    fontWeight: 600,
    lineHieght: '25px',
    color: COLORS.lightBlack,
  },
  ProfileList_helpfulText: {
    fontSize: '14px',
    color: COLORS.darkGray,
    lineHeight: '24px',
    marginBottom: '2rem'
  },
});

class ProfileList extends PureComponent {
  deleteMethod = async (id) => {
    const { itemName } = this.props;

    if (confirm("Are you sure you want to delete that?")) {
      await fetch(`/${itemName.toLowerCase()}/${id}`, {
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
      items,
      itemName,
      isUser,
      isSelectable,
      onSelect,
      selectGroup,
      selected,
      editMethod
    } = this.props;

    return (
      <div>
        {items.length === 0 &&
          <div className={css(styles.ProfileList_noResultsText)}>
            {isUser ? (
              <>
                <div className={css(styles.ProfileList_addPrompt)}>Add {itemName}</div>
                <div className={css(styles.ProfileList_helpfulText)}>Adding these will make your profile much more attractive to partners</div>
              </>
            ) : (
              <div className={css(styles.ProfileList_helpfulText)}>There are no {itemName} attached yet.</div>
            )}
            {isUser && <img src={emptyState} />}
          </div>}
        {
          items.map((item, idx) => {
            return (
              <ProfileRow
                key={`row-${idx}`}
                header={item.header}
                body={item.body}
                url={item.url}
                isUser={isUser}
                isSelectable={isSelectable}
                onSelect={onSelect}
                selectGroup={selectGroup}
                selected={selected}
                elementId={item.id}
                deleteMethod={this.deleteMethod}
                editMethod={editMethod}
                footerElements={item.footerElements}
                tagElement={item.tagElement}
              />
            );
          })
        }
      </div>
    );
  }
}

ProfileList.defaultProps = {
  items: [],
  itemName: '',
  isUser: false,
  isSelectable: false,
  onSelect: () => {},
  selected: [],
}

ProfileList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  itemName: PropTypes.string,
  isUser: PropTypes.bool,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selectGroup: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.any),
};

export default ProfileList;
