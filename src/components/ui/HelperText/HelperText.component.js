import React from 'react';
import PropTypes from 'prop-types';
import { HelperWrapper, Text } from './HelperText.style';

/**
 * The props of HelperText Component
 */

const HelperText = props => {
  return props.right ? (
    <HelperWrapper>
      <Text style={props.leftStyle}>{props.left}</Text>
      <Text style={props.rightStyle}>{props.right}</Text>
    </HelperWrapper>
  ) : (
    <Text style={props.leftStyle}>{props.left}</Text>
  );
};
HelperText.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
  leftStyle: PropTypes.object,
  rightStyle: PropTypes.object
};

export default HelperText;
