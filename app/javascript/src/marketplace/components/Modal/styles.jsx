import { css, StyleSheet } from 'aphrodite';
import { COLORS } from '../../../../constants';

export default StyleSheet.create({
  Modal: {
  },
  Modal_deleteButton: {
    backgroundColor: COLORS.transparent,
    float: 'left',
    height: '48px',
    textAlign: 'center',
    color: COLORS.gray,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '5px 50px',
    borderRadius: '4px',
    border: '1px solid ' + COLORS.gray
  }
});
