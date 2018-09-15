/**
 *
 * DerivationPathContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { utils } from 'ethers';

import HWPromptContainer from 'containers/HWPromptContainer';

import {
  loadWalletBalances,
} from 'containers/HubiiApiHoc/actions';

import {
  fetchLedgerAddresses,
} from 'containers/LedgerHoc/actions';

import {
  fetchTrezorAddresses,
} from 'containers/TrezorHoc/actions';

import {
  makeSelectBalances,
} from 'containers/HubiiApiHoc/selectors';

import {
  makeSelectLedgerHoc,
} from 'containers/LedgerHoc/selectors';

import {
  makeSelectTrezorHoc,
} from 'containers/TrezorHoc/selectors';


import DerivationPath from 'components/ImportWalletSteps/DerivationPath';

import { StyledButton, StyledSpan, ButtonDiv } from './BackBtn';
import HWPromptWrapper from './HWPromptWrapper';

export class DerivationPathContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      pathBase: props.pathBase,
      firstAddressIndex: 0,
      lastAddressIndex: 19,
    };
    this.fetchAddresses = this.fetchAddresses.bind(this);
    this.onChangePathBase = this.onChangePathBase.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  componentDidMount() {
    if (this.getDeviceInfo(this.props).get('status') === 'connected') {
      this.fetchAddresses();
    }
  }

  componentDidUpdate(prevProps) {
    const { balances } = this.props;
    const prevStatus = this.getDeviceInfo(prevProps).get('status');
    const curStatus = this.getDeviceInfo(this.props).get('status');
    if (prevStatus === 'disconnected' && curStatus === 'connected') {
      this.fetchAddresses();
    }

    const curAddresses = this.getDeviceInfo(this.props).get('addresses');
    const addresses = curAddresses.valueSeq().toArray();
    addresses.forEach((address) => {
      if (!balances.get(address)) {
        this.props.loadWalletBalances(address, true);
      }
    });
  }

  onChangePathBase(e) {
    const newBase = e.target.value;
    this.setState({ ...this.state, pathBase: newBase },
      this.fetchAddresses
    );
  }

  onSelectAddress(index) {
    const derivationPath = `${this.state.pathBase}/${index}`;
    const id = this.getDeviceInfo(this.props).get('id');
    const address = this.getDeviceInfo(this.props).getIn(['addresses', derivationPath]);
    if (!address) {
      return;
    }
    this.props.handleNext({ address, derivationPath, deviceId: id });
  }

  getDeviceInfo(props) {
    const { deviceType } = this.props;
    let deviceInfo;
    if (deviceType === 'lns') {
      deviceInfo = props.ledgerNanoSInfo;
    }
    if (deviceType === 'trezor') {
      deviceInfo = props.trezorInfo;
    }
    return deviceInfo;
  }

  fetchAddresses() {
    const { lastAddressIndex, pathBase } = this.state;
    const { deviceType } = this.props;
    if (deviceType === 'lns') {
      this.props.fetchLedgerAddresses(pathBase, lastAddressIndex + 1);
    }
    if (deviceType === 'trezor') {
      this.props.fetchTrezorAddresses(pathBase, lastAddressIndex + 1);
    }
  }

  render() {
    const { balances, deviceType } = this.props;
    const deviceInfo = this.getDeviceInfo(this.props);

    const { status, addresses, ethConnected } = deviceInfo.toJS();
    if
    (
      (deviceType !== 'lns' && status === 'disconnected')
      || (deviceType === 'lns' && !ethConnected)
    ) {
      return (
        <HWPromptWrapper>
          <HWPromptContainer passedDeviceType={deviceType} />
        </HWPromptWrapper>
      );
    }

    const { pathBase, lastAddressIndex } = this.state;
    const processedAddresses = [];
    let i;
    for (i = 0; i <= lastAddressIndex; i += 1) {
      const curDerivationPath = `${pathBase}/${i}`;
      const assetsState = balances.getIn([addresses[curDerivationPath], 'assets']);
      let balance = 'Loading...';
      if (assetsState) {
        const asset = assetsState.toJSON().find((ast) => ast.currency === 'ETH');
        balance = parseFloat(utils.formatEther(asset.balance));
      }
      processedAddresses.push({
        key: i,
        index: i,
        ethBalance: balance,
        address: addresses[curDerivationPath] ? `${addresses[curDerivationPath].slice(0, 18)}...` : 'Loading...',
      });
    }

    return (
      <div>
        <DerivationPath
          pathBase={pathBase}
          addresses={processedAddresses}
          onChangePathBase={this.onChangePathBase}
          onSelectAddress={this.onSelectAddress}
        />
        <ButtonDiv>
          <StyledButton type={'primary'} onClick={this.props.handleBack}>
            <StyledSpan>Back</StyledSpan>
          </StyledButton>
        </ButtonDiv>
      </div>
    );
  }
}

DerivationPathContainer.propTypes = {
  deviceType: PropTypes.string.isRequired,
  pathBase: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  ledgerNanoSInfo: PropTypes.object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  trezorInfo: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  fetchLedgerAddresses: PropTypes.func.isRequired,
  fetchTrezorAddresses: PropTypes.func.isRequired,
  loadWalletBalances: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  balances: makeSelectBalances(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    fetchLedgerAddresses: (...args) => dispatch(fetchLedgerAddresses(...args)),
    fetchTrezorAddresses: (...args) => dispatch(fetchTrezorAddresses(...args)),
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DerivationPathContainer);
