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
  makeSelectCurrentWalletDetails,
  makeSelectErrors,
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
    const wallet = this.props.currentWalletDetails;
    this.props.transfer({ wallet, token, toAddress, amount, gasPrice, gasLimit });
  }

  onCancel() {
    this.props.history.push(`/wallet/${this.props.currentWalletDetails.address}/overview`);
  }

  render() {
    const { contacts, currentWallet, currentWalletDetails } = this.props;
    if (currentWalletDetails.loadingBalancesError) {
      return <LoadingError pageType="Striim Accounts" error={currentWalletDetails.loadingBalancesError} id={currentWallet.toJS().address} />;
    }
    if (!currentWalletDetails.balances) {
      return <PageLoadingIndicator pageType="Loading wallet" id={currentWallet.toJS().address} />;
    }

    return (
      <TransferForm
        recipients={contacts.toJS()}
        currencies={currentWalletDetails.balances}
        onSend={this.onSend}
        onCancel={this.onCancel}
        transfering={currentWallet.toJS().transfering}
        errors={this.props.errors}
        currentWalletDetails={this.props.currentWalletDetails}
      />
    );
  }
}

WalletTransfer.propTypes = {
  currentWalletDetails: PropTypes.object.isRequired,
  currentWallet: PropTypes.object.isRequired,
  transfer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletDetails: makeSelectCurrentWalletDetails(),
  currentWallet: makeSelectCurrentWallet(),
  contacts: makeSelectContacts(),
  errors: makeSelectErrors(),
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
