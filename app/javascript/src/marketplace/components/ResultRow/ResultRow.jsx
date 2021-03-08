import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import { Button, Grid } from "semantic-ui-react";

import verifiedPartnerIcon from '../../../../images/icons/verified_partner_icon.svg';
import { COLORS } from '../../../../constants';

const styles = StyleSheet.create({
  ResultRow_resultContainer: {
    border: `1px solid ${COLORS.lightGray}`,
    margin: '20px auto',
    height: '200px',
    ':hover': {
      boxShadow: `0 6px 12px 0 ${COLORS.lightGray}`,
    },
  },
  ResultRow_grid: {
    padding: '24px 24px 28px 24px',
    margin: 0,
    position: 'relative',
  },
  ResultRow_gridRow: {
    margin: 0,
    padding: 0,
    display: 'block',
  },
  ResultRow_companyName: {
    fontSize: '14px',
    lineHeight: '24px',
    color: COLORS.gray,
  },
  ResultRow_saveButtonContainer: {
    padding: 0,
  },
  ResultRow_saveButton: {
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '15px',
    background: COLORS.lightBlue,
    backgroundImage: 'linear-gradient(134.72deg, #4E9DF5 0%, #48B2F4 100%)',
    color: COLORS.white,
    padding: '5px 20px',
  },
  ResultRow_title: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.lightBlack,
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
  },
  ResultRow_summary: {
    fontSize: '13px',
    marginBottom: '18px',
    color: COLORS.lightBlack,
    display: '-webkit-box',
    '-webkit-line-clamp': '2',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  ResultRow_therapeuticArea: {
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
  ResultRow_innovationType: {
    fontSize: '11px',
    display: 'inline-block',
    padding: '4px 10px',
    color: COLORS.lightBlack,
    border: `1px solid ${COLORS.lightBlack}`,
    borderRadius: '4px',
    width: 'fit-content',
    marginRight: '10px',
  },
  ResultRow_bottomRow: {

  },
  ResultRow_verifiedIcon: {
    marginLeft: '5px',
    marginRight: '5px',
  },
});

class ResultRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      savedRFPs: gon.saved_rfps,
    };
  }

  authenticityToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token && (token instanceof window.HTMLMetaElement)) {
      return token.content;
    }
    return null;
  };

  handleSave = async (e, id) => {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    const {
      isSaved,
      saveRFP,
      unsaveRFP,
      rfpId,
    } = this.props;

    if (isSaved) {
      await unsaveRFP(rfpId);
    } else {
      await saveRFP(rfpId);
    }
  };

  render() {
    const {
      company,
      title,
      summary,
      therapeuticArea,
      innovationTypes,
      rfpId,
      isUpdatingSaveRFP,
      isSaved,
      isPartner,
    } = this.props;

    return (
      <div className={css(styles.ResultRow_resultContainer)}>
        <Grid className={css(styles.ResultRow_grid)}>
          <Grid.Row columns={16} className={css(styles.ResultRow_gridRow)}>
            <Grid.Column width={8} textAlign="left" className={css(styles.ResultRow_companyName)}>
              <div>
                {company}
                {isPartner &&
                  <span className={css(styles.ResultRow_verifiedIcon)}><img src={verifiedPartnerIcon} /></span>}
              </div>
            </Grid.Column>
            {gon.logged_in &&
              <Grid.Column width={8} textAlign="right" className={css(styles.ResultRow_saveButtonContainer)}>
                <Button
                  className={css(styles.ResultRow_saveButton)}
                  disabled={isUpdatingSaveRFP}
                  onClick={(e) => this.handleSave(e, rfpId)}
                >
                  {isSaved ? "Unsave" : "Save"}
                </Button>
              </Grid.Column>}
          </Grid.Row>
          <Grid.Row className={css(styles.ResultRow_gridRow)}>
            <Grid.Column width={16}>
              <div className={css(styles.ResultRow_title)}>
                {title}
              </div>
              <div className={css(styles.ResultRow_summary)}>
                {summary}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className={css(styles.ResultRow_gridRow, styles.ResultRow_bottomRow)}>
            <Grid.Column width={16}>
              {therapeuticArea &&
                <div className={css(styles.ResultRow_therapeuticArea)}>
                  {therapeuticArea}
                </div>
              }
              {innovationTypes && innovationTypes.slice(0, 4).map((innovationType) => (
                innovationType &&
                  <div key={`innovation-type-${innovationType}`} className={css(styles.ResultRow_innovationType)}>
                    {innovationType}
                  </div>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

ResultRow.propTypes = {
  rfpId: PropTypes.number,
  title: PropTypes.string,
  company: PropTypes.string,
  summary: PropTypes.string,
  therapeuticArea: PropTypes.string,
  innovationTypes: PropTypes.arrayOf(PropTypes.string),
  isPreview: PropTypes.bool,
  saveRFP: PropTypes.func,
  unsaveRFP: PropTypes.func,
  isUpdatingSaveRFP: PropTypes.bool,
  isSaved: PropTypes.bool,
  isPartner: PropTypes.bool,
};

export default ResultRow;
