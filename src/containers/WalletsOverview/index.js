/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import WalletsOverview from './WalletsOverview.component';
// import cardsData from './cardsData';
import { makeSelectWallets } from 'containers/WalletManager/selectors';

export class WalletOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {wallets} = this.props
    const walletsJSON = wallets.toJS()
    const walletCards = []
    Object.keys(walletsJSON).forEach(type => {
      Object.keys(walletsJSON[type]).forEach(walletName => {
        try {
          const wallet = walletsJSON[type][walletName]
          const encrypted = JSON.parse(wallet.encrypted)
          walletCards.push({
            name: walletName,
            type,
            primaryAddress: encrypted.address,
            assets: wallet.tokens,
            totalBalance: 0//sum up usd value from wallet.tokens
          })
        }catch (e) {
          console.log(e)
        }
      })
    })
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

const withConnect = connect(mapStateToProps, null);

export default compose(
  withConnect,
)(WalletOverview);
