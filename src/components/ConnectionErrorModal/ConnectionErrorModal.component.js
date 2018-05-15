import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TextPrimary,
  Wrapper,
  StyledButton
} from './ConnectionErrorModal.style';

/**
 * This component shows error if wallet is not connected to server
 */
const ConnectionErrorModal = props => {
  return (
    <Wrapper>
      <Text> Wallet is not connnected</Text>
      <TextPrimary>
        Please connect the wallet first to transfer money
      </TextPrimary>
      <StyledButton type="primary" onClick={props.handleOK}>
        OK
      </StyledButton>
    </Wrapper>
  );
};
ConnectionErrorModal.propTypes = {
  /**
   * Function to perform action when ok button is clicked
   */
  handleOK: PropTypes.func
};
export default ConnectionErrorModal;
