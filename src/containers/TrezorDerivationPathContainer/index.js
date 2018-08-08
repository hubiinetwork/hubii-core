/**
 *
 * TrezorDerivationPathContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  fetchTrezorAddresses,
  loadWalletBalances,
} from 'containers/WalletHOC/actions';


import {
  makeSelectTrezorInfo,
  makeSelectBalances,
} from 'containers/WalletHOC/selectors';


import DerivationPath from 'components/ImportWalletSteps/DerivationPath';

import { StyledButton, StyledSpan, ButtonDiv } from './BackBtn';
import { ErrorWrapper } from './ErrorWrapper';
import { ErrorText } from './ErrorText';

export class TrezorDerivationPathContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      pathBase: 'm/44\'/60\'/0\'/0',
      firstAddressIndex: 0,
      lastAddressIndex: 19,
    };
    this.fetchAddresses = this.fetchAddresses.bind(this);
    this.onChangePathBase = this.onChangePathBase.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  componentDidMount() {
    if (this.props.trezorInfo.get('status') === 'connected') {
      this.fetchAddresses();
    }
  }

  componentDidUpdate(prevProps) {
    // const { balances, loadWalletBalances } = this.props;
    const prevTrezorStatus = prevProps.trezorInfo.get('status');
    const curTrezorStatus = this.props.trezorInfo.get('status');
    if (prevTrezorStatus === 'disconnected' && curTrezorStatus === 'connected') {
      this.fetchAddresses();
    }
    // const prevAddresses = prevProps.trezorInfo.get('addresses')
    // const curAddresses = this.props.trezorInfo.get('addresses')
    // const addresses = curAddresses.valueSeq().toArray()
    // console.log(prevAddresses.equals(curAddresses), addresses.length, this.state.lastAddressIndex + 1)
    // if (!prevAddresses.equals(curAddresses) && addresses.length === this.state.lastAddressIndex + 1) {
    //   addresses.forEach(address => {
    //     console.log('load', address)
    //     if (!balances.get(address)) {
    //       loadWalletBalances(address, true)
    //     }
    //   })
    // }
    // console.log(prevAddresses, curAddresses, prevAddresses == curAddresses, curAddresses.valueSeq().toArray())
  }

  onChangePathBase(e) {
    const newBase = e.target.value;
    this.setState({ ...this.state, pathBase: newBase },
      this.fetchAddresses
    );
  }

  onSelectAddress(index) {
    const derivationPath = `${this.state.pathBase}/${index}`;
    const id = this.props.trezorInfo.get('id');
    const address = this.props.trezorInfo.getIn(['addresses', derivationPath]);
    if (!address) {
      return;
    }
    this.props.handleNext({ address, derivationPath, deviceId: id });
  }

  fetchAddresses() {
    const { lastAddressIndex, pathBase } = this.state;
    this.props.fetchTrezorAddresses(pathBase, lastAddressIndex + 1);
  }

  render() {
    const { trezorInfo } = this.props;
    const { status, addresses } = trezorInfo.toJS();
    if (status === 'disconnected') {
      return (
        <ErrorWrapper>
          <ErrorText>Trezor is not connected</ErrorText>
        </ErrorWrapper>
      );
    }

    const { pathBase, lastAddressIndex } = this.state;
    const processedAddresses = [];
    let i;
    for (i = 0; i <= lastAddressIndex; i += 1) {
      const curDerivationPath = `${pathBase}/${i}`;
      processedAddresses.push({
        key: i,
        index: i,
        ethBalance: 'Feature coming soon',
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

TrezorDerivationPathContainer.propTypes = {
  trezorInfo: PropTypes.object.isRequired,
  fetchTrezorAddresses: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  trezorInfo: makeSelectTrezorInfo(),
  balances: makeSelectBalances(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchTrezorAddresses: (...args) => dispatch(fetchTrezorAddresses(...args)),
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(TrezorDerivationPathContainer);
