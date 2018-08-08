/**
 *
 * LnsDerivationPathContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { utils } from 'ethers';

import {
  fetchLedgerAddresses,
  loadWalletBalances,
} from 'containers/WalletHOC/actions';


import {
  makeSelectLedgerNanoSInfo,
  makeSelectErrors,
  makeSelectBalances,
} from 'containers/WalletHOC/selectors';


import DerivationPath from 'components/ImportWalletSteps/DerivationPath';

import { StyledButton, StyledSpan, ButtonDiv } from './BackBtn';
import { ErrorWrapper } from './ErrorWrapper';
import { ErrorText } from './ErrorText';

export class LnsDerivationPathContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      pathBase: 'm/44\'/60\'/0\'',
      firstAddressIndex: 0,
      lastAddressIndex: 19,
    };
    this.fetchAddresses = this.fetchAddresses.bind(this);
    this.onChangePathBase = this.onChangePathBase.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  componentDidMount() {
    if (this.props.ledgerNanoSInfo.get('status') === 'connected') {
      this.fetchAddresses();
    }
  }

  componentDidUpdate(prevProps) {
    const { balances } = this.props;
    const prevLedgerStatus = prevProps.ledgerNanoSInfo.get('status');
    const curLedgerStatus = this.props.ledgerNanoSInfo.get('status');
    if (prevLedgerStatus === 'disconnected' && curLedgerStatus === 'connected') {
      this.fetchAddresses();
    }

    const prevAddresses = prevProps.ledgerNanoSInfo.get('addresses');
    const curAddresses = this.props.ledgerNanoSInfo.get('addresses');
    const addresses = curAddresses.valueSeq().toArray();
    if (prevAddresses !== curAddresses) {
      addresses.forEach((address) => {
        // console.log(balances.get(address))
        if (!balances.get(address)) {
          this.props.loadWalletBalances(address, true);
        }
      });
    }
  }

  onChangePathBase(e) {
    const newBase = e.target.value;
    this.setState({ ...this.state, pathBase: newBase },
      this.fetchAddresses
    );
  }

  onSelectAddress(index) {
    const derivationPath = `${this.state.pathBase}/${index}`;
    const id = this.props.ledgerNanoSInfo.get('id');
    const address = this.props.ledgerNanoSInfo.getIn(['addresses', derivationPath]);
    this.props.handleNext({ address, derivationPath, deviceId: id });
  }

  fetchAddresses() {
    const { lastAddressIndex, pathBase } = this.state;
    this.props.fetchLedgerAddresses(pathBase, lastAddressIndex + 1);
  }

  render() {
    const { ledgerNanoSInfo, balances, errors } = this.props;
    const error = errors.get('ledgerError');
    const { status, addresses } = ledgerNanoSInfo.toJS();
    if (status === 'disconnected') {
      return (
        <ErrorWrapper>
          <ErrorText>{error || 'Loading...'}</ErrorText>
        </ErrorWrapper>
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

LnsDerivationPathContainer.propTypes = {
  ledgerNanoSInfo: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  fetchLedgerAddresses: PropTypes.func.isRequired,
  loadWalletBalances: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ledgerNanoSInfo: makeSelectLedgerNanoSInfo(),
  errors: makeSelectErrors(),
  balances: makeSelectBalances(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    fetchLedgerAddresses: (...args) => dispatch(fetchLedgerAddresses(...args)),
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(LnsDerivationPathContainer);
