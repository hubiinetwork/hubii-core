/**
 *
 * ConnectionStatus
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { makeSelectErrors } from './selectors';
import reducer from './reducer';
import {
  Wrapper,
  StatusIcon,
  StyledText,
} from './style';

export class ConnectionStatus extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { errors, currentNetwork } = this.props;
    const connectionIssue = errors.size > 0;
    const connectionStatus = {
      text: connectionIssue ? 'Reconnecting...' : 'Connected',
      iconType: connectionIssue ? 'loading' : 'check',
    };
    const networkText = currentNetwork.provider._network.chainId === 1 ? 'Mainnet' : 'Testnet';

    return (
      <Wrapper>
        <span warning={networkText === 'Testnet'}>
          <StyledText style={{ fontWeight: 'bold' }}>Network:</StyledText>&nbsp;
          <StyledText warning={networkText === 'Testnet'}>{networkText}</StyledText>
        </span>
        <span warning={connectionIssue} style={{ display: 'flex', alignItems: 'center' }}>
          <StyledText style={{ fontWeight: 'bold' }}>Status:</StyledText>&nbsp;
          <StyledText warning={connectionIssue}>{connectionStatus.text}</StyledText>&nbsp;
          <StatusIcon warning={connectionIssue} type={connectionStatus.iconType} />
        </span>
      </Wrapper>
    );
  }
}

ConnectionStatus.propTypes = {
  errors: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  errors: makeSelectErrors(),
  currentNetwork: makeSelectCurrentNetwork(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'connectionStatus', reducer });

export default compose(
  withReducer,
  withConnect,
)(ConnectionStatus);
