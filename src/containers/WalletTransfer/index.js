import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import TransferForm from 'components/TransferForm';
import { makeSelectWallets, makeSelectCurrentWallet } from 'containers/WalletManager/selectors';
import { convertWalletsList } from 'utils/wallet';

export class WalletTransfer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
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
    if (!currentWallet || !currentWallet.balances) {
      return (null);
    }

    return (
      <TransferForm
        address="0xf400db37c54c535febca1b470fd1d23d30acdd11"
        recipients={[
          { name: 'Jacobo', address: '0xf400db37c54c535febca1b470fd1d23d30ac12wd' },
          { name: 'Liam', address: '0xf400db37c54c535febca1b470fd1d23d30acdd11' },
          { name: 'Kata', address: '0xf400db37c54c535febca1b470fd1d23d30agh65' },
        ]}
        currencies={currentWallet.balances}
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

export function mapDispatchToProps() {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
)(WalletTransfer);
