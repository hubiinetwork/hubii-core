import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import TransferForm from 'components/TransferForm';
import { makeSelectWallets, makeSelectCurrentWallet } from 'containers/WalletManager/selectors';
import { transfer } from 'containers/WalletManager/actions';
import { convertWalletsList } from 'utils/wallet';

export class WalletTransfer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.onSend = this.onSend.bind(this)
  }

  onSend (token, toAddress, amount, gasPrice, gasLimit) {
    console.log(amount, gasPrice, gasLimit, this.getMatchedWallet())
    const wallet = this.getMatchedWallet()
    this.props.transfer({wallet, token, toAddress, amount, gasPrice, gasLimit})
  }

  getMatchedWallet() {
    const { wallets } = this.props;
    if (!wallets) {
      return null;
    }
    const walletsList = convertWalletsList(wallets);
    const matchedWallet = walletsList.find((wallet) => `0x${wallet.encrypted.address}` === this.props.currentWallet.toJS().address);
    return matchedWallet;
  }

  render() {
    const currentWallet = this.getMatchedWallet();
    console.log(currentWallet)
    if (!currentWallet || !currentWallet.balances) {
      return (null);
    }

    return (
      <TransferForm
        address="0xf400db37c54c535febca1b470fd1d23d30acdd11"
        recipients={[
          { name: 'Jacobo', address: '0xf400db37c54c535febca1b470fd1d23d30ac12wd' },
          { name: 'Liam', address: '0xf400db37c54c535febca1b470fd1d23d30acdd11' },
          { name: 'Kata', address: '0x83498a45BB6cF75fda53e86Bfb7febc5E7ebfE58' },
        ]}
        currencies={currentWallet.balances}
        onSend={this.onSend}
      />
    );
  }

}

WalletTransfer.propTypes = {
  wallets: PropTypes.object.isRequired,
  currentWallet: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wallets: makeSelectWallets(),
  currentWallet: makeSelectCurrentWallet(),
});

export function mapDispatchToProps(dispatch) {
  return {
    transfer: (...args) => dispatch(transfer(...args))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
)(WalletTransfer);
