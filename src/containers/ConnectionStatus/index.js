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
import { injectIntl } from 'react-intl';

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
    const { errors, currentNetwork, intl } = this.props;
    const { formatMessage } = intl;
    const connectionIssue = errors.size > 0;
    const connectionStatus = {
      text: connectionIssue
        ? formatMessage({ id: 'reconnecting' })
        : formatMessage({ id: 'connected' }),
      iconType: connectionIssue ? 'loading' : 'check',
    };
    const networkText = currentNetwork.provider._network.chainId === 1
      ? formatMessage({ id: 'mainnet' })
      : formatMessage({ id: 'testnet' });

    return (
      <Wrapper>
        <span warning={networkText === 'Testnet'}>
          <StyledText style={{ fontWeight: 'bold' }}>{formatMessage({ id: 'network' })}:</StyledText>&nbsp;
          <StyledText warning={networkText === 'Testnet'}>{networkText}</StyledText>
        </span>
        <span warning={connectionIssue} style={{ display: 'flex', alignItems: 'center' }}>
          <StyledText style={{ fontWeight: 'bold' }}>{formatMessage({ id: 'status' })}:</StyledText>&nbsp;
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
  intl: PropTypes.object.isRequired,
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
  injectIntl,
)(ConnectionStatus);
