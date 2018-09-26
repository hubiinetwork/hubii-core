/**
*
* HWPrompt
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';

import Text from 'components/ui/Text';

import {
  OuterWrapper,
  Row,
  KeyText,
  DescriptiveIcon,
  StatusIcon,
  SingleRowWrapper,
  SingleRowIcon,
  ConfTxDeviceImg,
  ConfTxShield,
} from './style';

const confTxOnDevicePrompt = (deviceType) => (
  <SingleRowWrapper>
    <ConfTxShield src={getAbsolutePath('public/images/shield.png')} />
    <ConfTxDeviceImg src={getAbsolutePath(`public/images/conf-tx-${deviceType}.png`)} />
    <Text large>{ 'Verify the details shown on your device' }</Text>
  </SingleRowWrapper>
);

const singleRowMsg = (msg, iconType, iconColor) => (
  <SingleRowWrapper>
    <SingleRowIcon type={iconType || 'loading'} color={iconColor} />
    <Text large>{msg}</Text>
  </SingleRowWrapper>
);

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
        <Text>Connect and unlock your <KeyText>Ledger Device</KeyText></Text>
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
        <Text>Open the <KeyText>Ethereum</KeyText> app on your device</Text>
        <StatusIcon
          type={stage === 'openApp' ? 'loading' : 'ellipsis'}
        />
      </Row>
    </OuterWrapper>
  );
};

const trezorPrompt = (trezorInfo) => {
  const error = trezorInfo.get('error');
  if (error && !error.includes('Trezor is not connected')) {
    return singleRowMsg(
        'Something went wrong, please reconnect your device and try again',
        'exclamation-circle-o',
        'orange'
      );
  }

    // device connection is good
  if (trezorInfo.get('status') === 'connected') {
    return singleRowMsg(
        'Device connection established',
        'check'
      );
  }

    // trezor needs to be connected
  return singleRowMsg(
      'Please connect and unlock your Trezor device to continue'
    );
};

class HWPrompt extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      deviceType,
      ledgerInfo,
      trezorInfo,
    } = this.props;

    const confTxOnDevice = deviceType === 'lns'
      ? ledgerInfo.get('confTxOnDevice')
      : trezorInfo.get('confTxOnDevice');

    // tx needs to be confirmed on device
    if (confTxOnDevice) {
      return confTxOnDevicePrompt(deviceType);
    }

    // handle ledger
    if (deviceType === 'lns') {
      return lnsPrompt(ledgerInfo);
    }

    // handle trezor
    return trezorPrompt(trezorInfo);
  }
}

HWPrompt.propTypes = {
  deviceType: PropTypes.oneOf(['lns', 'trezor']),
  ledgerInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
};

export default HWPrompt;
