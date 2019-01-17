import * as React from 'react';
import PropTypes from 'prop-types';
import nahmii from 'nahmii-sdk';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { walletReady } from 'utils/wallet';

import TransferForm from 'components/TransferForm';
import PageLoadingIndicator from 'components/PageLoadingIndicator';
import {
  makeSelectCurrentWallet,
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import {
  makeSelectGasStatistics,
} from 'containers/EthOperationsHoc/selectors';
import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';
import {
  makeSelectLedgerHoc,
} from 'containers/LedgerHoc/selectors';
import {
  makeSelectCurrentNetwork,
} from 'containers/App/selectors';
import {
  makeSelectTrezorHoc,
} from 'containers/TrezorHoc/selectors';
import {
  makeSelectContacts,
} from 'containers/ContactBook/selectors';
import {
  createContact,
} from 'containers/ContactBook/actions';
import { transfer as baseLayerTransfer } from 'containers/WalletHoc/actions';
import { makeNahmiiPayment as nahmiiTransfer } from 'containers/NahmiiHoc/actions';
import LoadingError from '../../components/LoadingError';

export class WalletTransfer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.sendBaseLayer = this.sendBaseLayer.bind(this);
  }

  componentDidUpdate(prevProps) {
    const prevCurrentWallet = prevProps.currentWallet.toJS();
    const currentWallet = this.props.currentWallet.toJS();
    if (prevCurrentWallet.transfering && !currentWallet.transfering && !currentWallet.transferError) {
      this.onCancel();
    }
  }

  onSend(symbol, toAddress, amount, layer, gasPrice, gasLimit) {
    if (layer === 'nahmii') {
      this.sendNahmii(symbol, toAddress, amount);
    } else {
      this.sendBaseLayer(symbol, toAddress, amount, gasPrice, gasLimit);
    }
  }

  onCancel() {
    this.props.history.push(`/wallet/${this.props.currentWalletWithInfo.address}/overview`);
  }

  sendBaseLayer(symbol, toAddress, amount, gasPrice, gasLimit) {
    let contractAddress;
    const wallet = this.props.currentWalletWithInfo.toJS();
    if (symbol !== 'ETH') {
      const asset = wallet.balances.baseLayer.assets.find((ast) => ast.symbol === symbol);
      contractAddress = asset.currency;
    }
    this.props.baseLayerTransfer({ wallet, token: symbol, toAddress, amount, gasPrice, gasLimit, contractAddress });
  }

  sendNahmii(symbol, toAddress, amount) {
    const { supportedAssets } = this.props;
    let ct;
    if (symbol === 'ETH') {
      ct = '0x0000000000000000000000000000000000000000';
    } else {
      ct = supportedAssets.get('assets').find((a) => a.get('symbol') === symbol).get('currency');
    }
    const monetaryAmount = new nahmii.MonetaryAmount(amount, ct);
    this.props.nahmiiTransfer(monetaryAmount, toAddress);
  }

  render() {
    const {
      gasStatistics,
      contacts,
      currentWallet,
      prices,
      currentWalletWithInfo,
      ledgerNanoSInfo,
      trezorInfo,
    } = this.props;
    if (!currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets'])) {
      return null;
    }
    if (currentWalletWithInfo.getIn(['balances', 'baseLayer', 'loading'])) {
      return <PageLoadingIndicator pageType="wallet" id={currentWalletWithInfo.get('address')} />;
    } else if (currentWalletWithInfo.getIn(['balances', 'baseLayer', 'error'])) {
      return <LoadingError pageType="wallet" error={{ message: 'Failed to fetch wallet data' }} id={currentWalletWithInfo.get('address')} />;
    }

    // get if the hw wallet is ready to make tx
    const hwWalletReady = walletReady(currentWalletWithInfo.get('type'), ledgerNanoSInfo, trezorInfo);
    return (
      <TransferForm
        supportedAssets={this.props.supportedAssets}
        currentNetwork={this.props.currentNetwork}
        hwWalletReady={hwWalletReady}
        prices={prices.toJS()}
        recipients={contacts.toJS()}
        onSend={this.onSend}
        transfering={currentWallet.toJS().transfering}
        currentWalletWithInfo={this.props.currentWalletWithInfo}
        createContact={this.props.createContact}
        gasStatistics={gasStatistics}
      />
    );
  }
}

WalletTransfer.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  currentWallet: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  baseLayerTransfer: PropTypes.func.isRequired,
  nahmiiTransfer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  createContact: PropTypes.func.isRequired,
  gasStatistics: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  currentNetwork: makeSelectCurrentNetwork(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  currentWallet: makeSelectCurrentWallet(),
  supportedAssets: makeSelectSupportedAssets(),
  prices: makeSelectPrices(),
  contacts: makeSelectContacts(),
  gasStatistics: makeSelectGasStatistics(),
});

export function mapDispatchToProps(dispatch) {
  return {
    baseLayerTransfer: (...args) => dispatch(baseLayerTransfer(...args)),
    nahmiiTransfer: (...args) => dispatch(nahmiiTransfer(...args)),
    createContact: (...args) => dispatch(createContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
)(WalletTransfer);
