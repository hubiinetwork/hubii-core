import React from 'react';
import PropTypes from 'prop-types';
import { HelperWrapper, Text } from './HelperText.style';

/**
 * This component is designed to show Hubii design specific requirement i.e. showing text on left and right under input component as helperText.
 */

const HelperTextComponent = props => {
  return props.right ? (
    <HelperWrapper>
      <Text style={props.leftStyle}>{props.left}</Text>
      <Text style={props.rightStyle}>{props.right}</Text>
    </HelperWrapper>
  ) : (
    <Text style={props.leftStyle}>{props.left}</Text>
  );
};
HelperTextComponent.propTypes = {
  /**
   * left prop of HelperTextComponent to  show text on Left
   */
  left: PropTypes.string,
  /**
   * right prop of HelperTextComponent to  show text on Right
   */
  right: PropTypes.string,
  /**
   * prop  to style text on left of thee HelperTextComponent
   */
  leftStyle: PropTypes.object,
  /**
   * prop  to style text on right of thee HelperTextComponent
   */
  rightStyle: PropTypes.object
};

export default HelperTextComponent;
