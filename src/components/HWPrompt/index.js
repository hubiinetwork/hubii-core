/**
*
* HWPrompt
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';

import {
  OuterWrapper,
  Row,
  KeyText,
  P,
  DescriptiveIcon,
  StatusIcon,
  SingleRowWrapper,
  SingleRowIcon,
  ConfTxDeviceImg,
  ConfTxShield,
} from './style';

const lnsPrompt = (ledgerInfo) => {
  const error = ledgerInfo.get('error');
  // check if device is connected
  if (ledgerInfo.get('ethConnected')) {
    return singleRowMsg(
        'Device connection established',
        'check'
      );
  }

  // check the error
  if (error && error.includes("Ledger connected but does not appear to have 'Browser support'")) {
    return singleRowMsg(
      "Please set 'Browser support' to 'No' in your device settings to continue"
    );
  } else if
  (
    error
    && !error.includes('does not appear to have the Ethereum app open')
    && !error.includes('Ledger could not be detected')
  ) {
    return singleRowMsg(
      'Something went wrong, please reconnect your device and try again',
      'exclamation-circle-o',
      'orange'
    );
  }
  // no errors, show prompts
  let stage;
  if (!ledgerInfo.get('connected')) {
    stage = 'connect';
  } else if (!ledgerInfo.get('ethConnected')) {
    stage = 'openApp';
  } else {
    return singleRowMsg(
        'Device connection established',
        'check'
    );
  }
  return (
    <OuterWrapper>
      <Row pos="top" active={stage === 'connect'}>
        <DescriptiveIcon
          src={stage === 'connect' ?
            getAbsolutePath('public/images/hw-wallet-usb-green.png') :
            getAbsolutePath('public/images/hw-wallet-usb-white.png')
          }
        />
        <P>Connect and unlock your <KeyText>Ledger Device</KeyText></P>
        <StatusIcon
          type={stage === 'connect' ? 'loading' : 'check'}
        />
      </Row>
      <Row pos="bottom" active={stage === 'openApp'}>
        <DescriptiveIcon
          src={stage === 'connect' ?
            getAbsolutePath('public/images/hw-wallet-eth-grey.png') :
            getAbsolutePath('public/images/hw-wallet-eth-green.png')
          }
        />
        <P>Open the <KeyText>Ethereum</KeyText> app on your device</P>
        <StatusIcon
          type={stage === 'openApp' ? 'loading' : 'ellipsis'}
        />
      </Row>
    </OuterWrapper>
  );
};

const confTxOnDevicePrompt = (deviceType) => (
  <SingleRowWrapper>
    <ConfTxShield src={getAbsolutePath('public/images/shield.png')} />
    <ConfTxDeviceImg src={getAbsolutePath(`public/images/conf-tx-${deviceType}.png`)} />
    <P>{ 'Verify the details shown on your device' }</P>
  </SingleRowWrapper>
);

const singleRowMsg = (msg, iconType, iconColor) => (
  <SingleRowWrapper>
    <SingleRowIcon type={iconType || 'loading'} color={iconColor} />
    <P>{msg}</P>
  </SingleRowWrapper>
);

class HWPrompt extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    if (nextProps.error === 'Loading...') return false;
    return true;
  }

  render() {
    const {
      deviceType,
      confTxOnDevice,
      ledgerInfo,
      error,
    } = this.props;

    // tx needs to be confirmed on device
    if (confTxOnDevice) {
      return confTxOnDevicePrompt(deviceType);
    }

    // handle ledger
    if (deviceType === 'lns') {
      return lnsPrompt(ledgerInfo);
    }

    // device connection is good
    if (!error) {
      return singleRowMsg(
        'Device connection established',
        'check'
      );
    }

    // trezor needs to be connected
    return singleRowMsg(
      'Please connect and unlock your Trezor device to continue'
    );
  }
}

HWPrompt.propTypes = {
  error: PropTypes.string,
  deviceType: PropTypes.oneOf(['lns', 'trezor']),
  ledgerInfo: PropTypes.object.isRequired,
  confTxOnDevice: PropTypes.bool,
};

export default HWPrompt;
