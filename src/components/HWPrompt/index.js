/**
*
* HWPrompt
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import {
  OuterWrapper,
  Row,
  KeyText,
  P,
  DescriptiveIcon,
  StatusIcon,
  SingleRowWrapper,
  SingleRowIcon,
} from './style';

const lnsPrompt = (error) => {
  let stage;
  if (error.includes('Ledger could not be detected')) {
    stage = 'connect';
  } else if (error.includes('does not appear to have the Ethereum app open')) {
    stage = 'openApp';
  } else if (error.includes("does not appear to have 'Browser support'")) {
    return singleRowMsg(
      "Please set 'Browser support' to 'No' in your device settings to continue"
    );
  } else {
    return singleRowMsg(
      'Something went wrong, please reconnect your device and try again',
      'exclamation-circle-o',
      'orange'
    );
  }
  return (
    <OuterWrapper>
      <Row pos="top" active={stage === 'connect'}>
        <DescriptiveIcon type="link" active={(stage === 'connect').toString()} />
        <P>Connect and unlock your <KeyText>Ledger Device</KeyText></P>
        <StatusIcon
          type={stage === 'connect' ? 'loading' : 'check'}
        />
      </Row>
      <Row pos="bottom" active={stage === 'openApp'}>
        <DescriptiveIcon type="link" active={(stage === 'openApp').toString()} />
        <P>Open the <KeyText>Ethereum</KeyText> app on your device</P>
        <StatusIcon
          type={stage === 'openApp' ? 'loading' : 'ellipsis'}
        />
      </Row>
    </OuterWrapper>
  );
};

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
    const { error, deviceType } = this.props;
    if (deviceType === 'lns') {
      return lnsPrompt(error);
    }
    return singleRowMsg(
      'Please connect and unlock your Trezor device to continue'
    );
  }
}

HWPrompt.propTypes = {
  error: PropTypes.string.isRequired,
  deviceType: PropTypes.oneOf(['lns', 'trezor']),
};

export default HWPrompt;
