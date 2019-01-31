import React from 'react';
import PropTypes from 'prop-types';
import { HelperWrapper, Text } from './style';

const HelperTextComponent = (props) => props.right ? (
  <HelperWrapper>
    <Text style={props.leftStyle}>{props.left}</Text>
    <Text style={props.rightStyle}>{props.right}</Text>
  </HelperWrapper>
  ) : (
    <Text style={props.leftStyle}>{props.left}</Text>
  );
HelperTextComponent.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
  leftStyle: PropTypes.object,
  rightStyle: PropTypes.object,
};

export default HelperTextComponent;
