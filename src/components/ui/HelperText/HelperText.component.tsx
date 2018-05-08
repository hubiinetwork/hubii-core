import * as React from "react";
import { IPropTypes } from "./index";
import { HelperWrapper, Text } from "./HelperText.style";

/**
 * The props of HelperText Component
 * @param {Object} props.style Get the style object.
 * @param {string} props.text Text to be shown as helperText.
 */

const HelperText = (props: IPropTypes) => {
  return props.right ? (
    <HelperWrapper>
      <Text style={props.leftStyle}>{props.left}</Text>
      <Text style={props.rightStyle}>{props.right}</Text>
    </HelperWrapper>
  ) : (
    <Text style={props.leftStyle}>{props.left}</Text>
  );
};

export default HelperText;
