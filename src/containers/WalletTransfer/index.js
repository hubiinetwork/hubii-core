import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import TransferForm from 'components/TransferForm';
import LoadingError from 'components/LoadingError';
import PageLoadingIndicator from 'components/PageLoadingIndicator';
import {
  makeSelectCurrentWallet,
  makeSelectCurrentWalletWithInfo,
  makeSelectPrices,
} from 'containers/WalletHOC/selectors';
import {
  makeSelectContacts,
} from 'containers/ContactBook/selectors';
import { transfer } from 'containers/WalletHOC/actions';

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
    const wallet = this.props.currentWalletWithInfo.toJS();
    this.props.transfer({ wallet, token, toAddress, amount, gasPrice, gasLimit });
  }

  onCancel() {
    this.props.history.push(`/wallet/${this.props.currentWalletWithInfo.address}/overview`);
  }

  render() {
    const { contacts, currentWallet, prices, currentWalletWithInfo } = this.props;
    if (currentWalletWithInfo.get('loadingBalancesError')) {
      return <LoadingError pageType="Striim Accounts" error={currentWalletWithInfo.get('loadingBalancesError')} id={currentWalletWithInfo.get('address')} />;
    }
    if (!currentWalletWithInfo.get('balances') || currentWalletWithInfo.getIn(['balances', 'loading'])) {
      return <PageLoadingIndicator pageType=" wallet balance" id={currentWalletWithInfo.get('address')} />;
    }

    return (
      <TransferForm
        prices={prices.toJS()}
        recipients={contacts.toJS()}
        assets={currentWalletWithInfo.getIn(['balances', 'assets']).toJS()}
        onSend={this.onSend}
        onCancel={this.onCancel}
        transfering={currentWallet.toJS().transfering}
      />
    );
  }
}

WalletTransfer.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  currentWallet: PropTypes.object.isRequired,
  transfer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  currentWallet: makeSelectCurrentWallet(),
  prices: makeSelectPrices(),
  contacts: makeSelectContacts(),
});

export function mapDispatchToProps(dispatch) {
  return {
    transfer: (...args) => dispatch(transfer(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
)(WalletTransfer);
