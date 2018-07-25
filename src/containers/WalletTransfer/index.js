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
    const wallet = this.props.currentWalletWithInfo;
    this.props.transfer({ wallet, token, toAddress, amount, gasPrice, gasLimit });
  }

  onCancel() {
    this.props.history.push(`/wallet/${this.props.currentWalletWithInfo.address}/overview`);
  }

  render() {
    const { contacts, currentWallet, currentWalletWithInfo } = this.props;
    if (currentWalletWithInfo.loadingBalancesError) {
      return <LoadingError pageType="Striim Accounts" error={currentWalletWithInfo.loadingBalancesError} id={currentWallet.toJS().address} />;
    }
    if (!currentWalletWithInfo.balances) {
      return <PageLoadingIndicator pageType=" wallet balance" id={currentWallet.toJS().address} />;
    }

    return (
      <TransferForm
        address="0xf400db37c54c535febca1b470fd1d23d30acdd11"
        recipients={contacts.toJS()}
        currencies={currentWalletWithInfo.balances}
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
  contacts: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  currentWallet: makeSelectCurrentWallet(),
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
