import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import TransferForm from 'components/TransferForm';
import {
  makeSelectCurrentWalletDetails,
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

  onSend(token, toAddress, amount, gasPrice, gasLimit) {
    const wallet = this.props.currentWalletDetails;
    this.props.transfer({ wallet, token, toAddress, amount, gasPrice, gasLimit });
  }

  onCancel() {
    this.props.history.push(`/wallet/${this.props.currentWalletDetails.address}/overview`);
  }

  render() {
    const { contacts } = this.props;
    const currentWallet = this.props.currentWalletDetails;
    if (!currentWallet || !currentWallet.balances) {
      return (null);
    }


    return (
      <TransferForm
        address="0xf400db37c54c535febca1b470fd1d23d30acdd11"
        recipients={contacts.toJS()}
        currencies={currentWallet.balances}
        onSend={this.onSend}
        onCancel={this.onCancel}
      />
    );
  }
}

WalletTransfer.propTypes = {
  currentWalletDetails: PropTypes.object.isRequired,
  transfer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletDetails: makeSelectCurrentWalletDetails(),
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
