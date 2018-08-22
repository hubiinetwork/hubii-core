import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { isHardwareWallet } from 'utils/wallet';

import TransferForm from 'components/TransferForm';
import PageLoadingIndicator from 'components/PageLoadingIndicator';
import {
  makeSelectCurrentWallet,
  makeSelectSupportedAssets,
  makeSelectCurrentWalletWithInfo,
  makeSelectPrices,
  makeSelectErrors,
  makeSelectLedgerNanoSInfo,
  makeSelectTrezorInfo,
} from 'containers/WalletHOC/selectors';
import {
  makeSelectContacts,
} from 'containers/ContactBook/selectors';
import {
  createContact,
} from 'containers/ContactBook/actions';
import { transfer } from 'containers/WalletHOC/actions';
import LoadingError from '../../components/LoadingError';

export class WalletTransfer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidUpdate(prevProps) {
    const prevCurrentWallet = prevProps.currentWallet.toJS();
    const currentWallet = this.props.currentWallet.toJS();
    if (prevCurrentWallet.transfering && !currentWallet.transfering && !currentWallet.transferError) {
      this.onCancel();
    }
  }

  onSend(token, toAddress, amount, gasPrice, gasLimit) {
    let contractAddress;
    const wallet = this.props.currentWalletWithInfo.toJS();
    if (token !== 'ETH') {
      const asset = wallet.balances.assets.find((ast) => ast.symbol === token);
      contractAddress = asset.currency;
    }
    this.props.transfer({ wallet, token, toAddress, amount, gasPrice, gasLimit, contractAddress });
  }

  onCancel() {
    this.props.history.push(`/wallet/${this.props.currentWalletWithInfo.address}/overview`);
  }

  render() {
    const { contacts, currentWallet, prices, currentWalletWithInfo } = this.props;
    if (!currentWalletWithInfo.getIn(['balances', 'assets'])) {
      return null;
    }
    if (currentWalletWithInfo.getIn(['balances', 'loading'])) {
      return <PageLoadingIndicator pageType="wallet" id={currentWalletWithInfo.get('address')} />;
    } else if (currentWalletWithInfo.getIn(['balances', 'error'])) {
      return <LoadingError pageType="wallet" error={{ message: 'Failed to fetch wallet data' }} id={currentWalletWithInfo.get('address')} />;
    }

    let confTxOnDevice = false;
    if (isHardwareWallet(currentWalletWithInfo.get('type'))) {
      confTxOnDevice = currentWalletWithInfo.get('type') === 'lns' ?
        this.props.ledgerNanoSInfo.get('confTxOnDevice') :
        this.props.trezorInfo.get('confTxOnDevice');
    }

    return (
      <TransferForm
        currentWalletUsdBalance={currentWalletWithInfo.getIn(['balances', 'total', 'usd']).toNumber()}
        supportedAssets={this.props.supportedAssets}
        prices={prices.toJS()}
        recipients={contacts.toJS()}
        assets={currentWalletWithInfo.getIn(['balances', 'assets']).toJS()}
        onSend={this.onSend}
        onCancel={this.onCancel}
        transfering={currentWallet.toJS().transfering}
        errors={this.props.errors}
        currentWalletWithInfo={this.props.currentWalletWithInfo}
        createContact={this.props.createContact}
        confTxOnDevice={confTxOnDevice}
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
  transfer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createContact: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerNanoSInfo: makeSelectLedgerNanoSInfo(),
  trezorInfo: makeSelectTrezorInfo(),
  currentWallet: makeSelectCurrentWallet(),
  supportedAssets: makeSelectSupportedAssets(),
  prices: makeSelectPrices(),
  contacts: makeSelectContacts(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    transfer: (...args) => dispatch(transfer(...args)),
    createContact: (...args) => dispatch(createContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
)(WalletTransfer);
