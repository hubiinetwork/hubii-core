/**
 *
 * ConnectionStatus
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { makeSelectBlockHeight } from 'containers/EthOperationsHoc/selectors';
import { makeSelectErrors } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  Wrapper,
  StatusIcon,
  StyledText,
} from './style';

export class ConnectionStatus extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { errors, currentNetwork, blockHeight, intl } = this.props;
    const { formatMessage } = intl;
    const connectionIssue = errors.size > 0;
    const connectionStatus = {
      text: connectionIssue
        ? formatMessage({ id: 'reconnecting' })
        : formatMessage({ id: 'connected' }),
      iconType: connectionIssue ? 'loading' : 'check',
    };
    const { chainId } = currentNetwork.provider._network;
    const networkText = chainId === 1
      ? formatMessage({ id: 'mainnet' })
      : formatMessage({ id: 'testnet' });
    return (
      <Wrapper>
        <span>
          <Tooltip title={`${formatMessage({ id: 'block_height' })}: ${blockHeight.get('height')}`}>
            <StyledText style={{ fontWeight: 'bold' }}>{formatMessage({ id: 'network' })}:</StyledText>&nbsp;
            <StyledText warning={chainId !== 1}>{networkText}</StyledText>
          </Tooltip>
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <StyledText style={{ fontWeight: 'bold' }}>{formatMessage({ id: 'status' })}:</StyledText>&nbsp;
          <StyledText warning={connectionIssue}>{connectionStatus.text}</StyledText>&nbsp;
          <StatusIcon warning={connectionIssue ? 1 : 0} type={connectionStatus.iconType} />
        </span>
      </Wrapper>
    );
  }
}

ConnectionStatus.propTypes = {
  errors: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  blockHeight: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  errors: makeSelectErrors(),
  currentNetwork: makeSelectCurrentNetwork(),
  blockHeight: makeSelectBlockHeight(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'connectionStatus', reducer });
const withSaga = injectSaga({ key: 'connectionStatus', saga });

export default compose(
  withReducer,
  withConnect,
  withSaga,
  injectIntl,
)(ConnectionStatus);
