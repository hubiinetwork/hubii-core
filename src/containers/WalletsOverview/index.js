/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from './WalletsOverview.component';
// import cardsData from './cardsData';
import { makeSelectWallets } from 'containers/WalletManager/selectors';
import { loadWalletBalances } from 'containers/WalletManager/actions';

export class WalletOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidUpdate(prevProps) {
    const {wallets, loadWalletBalances} = this.props
    if (prevProps.wallets !== wallets) {
      let walletCardsData = this.convertWalletsList(wallets)
      walletCardsData.forEach(wallet => {
        if (!wallet.balances && !wallet.loadingBalancesError && !wallet.loadingBalances) {
          loadWalletBalances(wallet.name, `0x${wallet.encrypted.address}`)
        }
      })
    }
  }

  getWalletCardsData (walletsState) {
    const {loadWalletBalances} = this.props
    return this.convertWalletsList(walletsState).map(wallet => {
      let assets, usdValue = 0
      if (wallet.balances) {
        assets = wallet.balances.map(token => {
          return {
            name: token.symbol,
            amount: parseInt(token.balance) / Math.pow(10, token.decimals),
            price: token.price,
            color: token.primaryColor
          }
        })
        usdValue = assets.reduce((accumulator, current) => {
          return accumulator + parseFloat(current.price.USD) * current.amount
        }, 0)
      }
      return {
        name: wallet.name,
        type: wallet.type,
        primaryAddress: `0x${wallet.encrypted.address}`,
        assets: assets || [],
        totalBalance: usdValue,
        loadingAssets: wallet.loadingBalances,
        loadingAssetsError: wallet.loadingBalancesError,
      };
    })
  }
  
  convertWalletsList(walletsState) {
    const walletsJSON = walletsState.toJS()
    const wallets = []
    Object.keys(walletsJSON).forEach(type => {
      Object.keys(walletsJSON[type]).forEach(walletName => {
        try {
          const wallet = walletsJSON[type][walletName]
          wallet.encrypted = JSON.parse(wallet.encrypted)
          wallet.type = type
          wallet.name = walletName
          wallets.push(wallet)
        }catch (e) {
          console.log(e)
        }
      })
    })

    return wallets
  }

  render() {
    const {wallets} = this.props

    const walletCards = this.getWalletCardsData(wallets)
    
    return (
      <WalletsOverview cards={walletCards} history={this.props.history} />
    );
  }
}

WalletOverview.propTypes = {
  wallets: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wallets: makeSelectWallets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletOverview);
