import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import { Grid, Icon, Checkbox } from "semantic-ui-react";

import { getUrlParameter } from '../../utils/requests';
import { COLORS } from '../../../../constants';

const styles = StyleSheet.create({
  ProfileRow_resultContainer: {
    margin: '20px auto',
  },
  ProfileRow_grid: {
    padding: '20px 40px 20px 0',
    margin: 0,
    position: 'relative',
  },
  ProfileRow_gridRow: {
    margin: 0,
    padding: 0,
  },
  ProfileRow_header: {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: 'bold',
    color: COLORS.lightBlack,
    cursor: 'pointer',
    marginBottom: '8px',
  },
  ProfileRow_body: {
    fontSize: '14px',
    marginBottom: '10px',
    color: COLORS.lightBlack,
  },
  ProfileRow_footerElement: {
    color: COLORS.gray,
    whiteSpace: 'nowrap',
    fontSize: '12px',
    fontWeight: 500,
    opacity: '0.7',
  },
  ProfileRow_headerText: {
    display: 'inline-block',
    textDecoration: 'none',
    color: COLORS.lightBlack,
  },
  ProfileRow_caret: {
    display: 'inline-block',
    border: 'none',
    position: 'absolute',
    right: '-30px',
    top: '5px',
    fontSize: '20px',
  },
  ProfileRow_iconButton: {
    color: COLORS.gray,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginLeft: '10px',
    position: 'absolute',
    right: '-30px',
    top: '0px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  ProfileRow_editIcon: {
    width: '22px'
  },
  ProfileRow_checkboxButton: {
    color: COLORS.yellow,
    marginLeft: '10px',
    position: 'absolute',
    right: '-24px',
    top: '0px',
    fontSize: '20px',
    display: 'inline-block',
    cursor: 'pointer',
  },
});

class ProfileRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      rowEdit: false,
    };
  }

  render() {
    const {
      header,
      body,
      url,
      footerElements,
      isUser,
      elementId,
      editMethod,
      togglePatentModal,
      isSelectable,
      onSelect,
      selectGroup,
      selected,
      tagElement
    } = this.props;
    const {
      expanded,
      rowEdit,
    } = this.state;

    const isPublic = getUrlParameter('public') === 'true';

    return (
      <div
        className={css(styles.ProfileRow_resultContainer)}
        onMouseEnter={() => this.setState({ rowEdit: true })}
        onMouseLeave={() => this.setState({ rowEdit: false })}
      >
        {tagElement}
        <Grid className={css(styles.ProfileRow_grid)}>
          <Grid.Row columns={16} className={css(styles.ProfileRow_gridRow)}>
            <Grid.Column width={16} textAlign="left" className={css(styles.ProfileRow_header)}>
              {url ? (
                <a href={url.startsWith('http') ? url : `//${url}`} target="_blank" className={css(styles.ProfileRow_headerText)}>
                  {header}
                </a>
              ) : (
                <div className={css(styles.ProfileRow_headerText)}>
                  {header}
                </div>
              )}
              <Icon
                className={css(styles.ProfileRow_caret)}
                size="small"
                onClick={() => this.setState({ expanded: !this.state.expanded })}
                name={expanded ? "chevron up" : "chevron down"} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className={css(styles.ProfileRow_gridRow)}>
            <Grid.Column width={16}>
              <div
                className={css(styles.ProfileRow_body)}
                style={{
                  minHeight: '48px',
                  height: expanded ? '100%' : '48px',
                  overflowY: expanded  ? 'inherit' : 'hidden',
                }}
              >
                {body}
              </div>

              {isUser && !isPublic && !isSelectable &&
                <div className={css(styles.ProfileRow_iconButton)}>
                  <Icon onClick={() => editMethod(elementId)} name='edit' className={css(styles.ProfileRow_editIcon)} />
                </div>}
              {isSelectable &&
                <div className={css(styles.ProfileRow_checkboxButton)}>
                  <Checkbox
                    name={selectGroup}
                    onChange={onSelect}
                    checked={selected.includes(elementId)}
                    value={elementId}
                  />
                </div>}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className={css(styles.ProfileRow_gridRow, styles.ProfileRow_bottomRow)}>
            {footerElements.map((footerElement, i) => {
              if(!footerElement) return;

              const text = _.isString(footerElement) ? footerElement : footerElement.text;
              const width =  _.isObject(footerElement) ?
                              footerElement.width :
                              i === footerElements.length - 1 ? (16 - (footerElements.length - 1) * 4) : 4;

              return (
                <Grid.Column
                  width={width}
                  key={`footer-element-${i}`}
                  className={css(styles.ProfileRow_footerElement)}>
                  {text}
                </Grid.Column>
              );
            })}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

ProfileRow.defaultProps = {
  isSelectable: false,
  onSelect: () => {},
  selected: [],
};

ProfileRow.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
  isUser: PropTypes.bool,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selectGroup: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.any),
  elementId: PropTypes.any,
  editMethod: PropTypes.func,
  tagElement: PropTypes.any,
  footerElements: PropTypes.arrayOf(
    PropTypes.oneOfType(
      [
        PropTypes.string,
        PropTypes.object
      ]
    )
  ),
};

export default ProfileRow;
