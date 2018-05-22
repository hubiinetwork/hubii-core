import React from 'react';
import { Slanted, USB, TextWhite } from './USBFlag.style';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

/**
 * This component shows status of the user's API connection with wallet by showing connected flag.
 * For proper UI, give style={{overflow:'hidden}} to the parent container.
 */

const USBFlag = props => (
  <Slanted connected={props.connected}>
    <Tooltip
      placement="right"
      title={
        props.connected ? (
          <TextWhite>Connected</TextWhite>
        ) : (
          <TextWhite>Not connected</TextWhite>
        )
      }
    >
      <USB
        type={props.connected ? 'check' : 'close'}
        style={{
          color: props.connected ? '#2f4d5c' : 'white'
        }}
      />
    </Tooltip>
  </Slanted>
);
USBFlag.propTypes = {
  /**
   * shows whether a wallet is connected or not.
   */
  connected: PropTypes.bool.isRequired
};

USBFlag.defaultProps = {
  connected: true
};
export default USBFlag;
