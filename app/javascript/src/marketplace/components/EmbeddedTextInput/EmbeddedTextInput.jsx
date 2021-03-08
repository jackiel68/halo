import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import { TextArea } from 'semantic-ui-react';

import { COLORS } from '../../../../constants';

const styles = StyleSheet.create({
  EmbeddedTextInput: {
    color: COLORS.lightBlack,
    fontSize: '18px',
    height: '50px',
    width: '100%',
    margin: 'auto',
    marginBottom: 0,
    padding: '10px',
    paddingTop: '13px',
    lineHeight: '20px',
    borderStyle: 'solid',
    borderColor: COLORS.white,
    borderRadius: '5px',
    borderWidth: '2px',
    resize: 'none',
    ':hover' : {
      borderColor: COLORS.gray,
    },
    ':focus' : {
      outline: 'none',
      color: COLORS.lightBlack,
      boxShadow: 'none',
      borderColor: COLORS.blue
    }
  }
});

const defaultKeypressHandler = (event, key) => {
  switch (event.key) {
    case 'Enter':
    return event.target.blur();
  }
};

const EmbeddedTextInput = (props) => {
  return (
    <TextArea
      onKeyPress={event => defaultKeypressHandler(event, 'Enter')}
      {...props}
      className={props.className + ' ' + css(styles.EmbeddedTextInput)}
    />
  );
};

// EmbeddedTextInput.propTypes and defaultProps handled by semantic TextArea component

export default EmbeddedTextInput;
