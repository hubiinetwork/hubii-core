import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col } from 'antd';

import { deleteWallet, showDecryptWalletModal, setCurrentWallet } from 'containers/WalletHOC/actions';
import { makeSelectLedgerNanoSInfo, makeSelectTotalBalances, makeSelectWalletsWithInfo } from 'containers/WalletHOC/selectors';

import { SectionHeading } from 'components/ui/SectionHeading';
import WalletItemCard from 'components/WalletItemCard';
import Breakdown from 'components/Breakdown';

import { WalletCardsCol, Wrapper } from './style';

export class WalletsOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.renderWalletCards = this.renderWalletCards.bind(this);
  }

  // getWalletCardsData(walletList) {
  //   return walletList.map((wallet) => {
  //     let assets;
  //     let usdValue = 0;
  //     let connected;
  //     if (wallet.balances) {
  //       assets = wallet.balances.map((token) => ({
  //         name: token.symbol,
  //         amount: parseInt(token.balance, 10) / (10 ** token.decimals),
  //         price: token.price,
  //         color: token.primaryColor,
  //       }));
  //       usdValue = assets.reduce((accumulator, current) => accumulator + (parseFloat(current.price.USD) * current.amount), 0);
  //     }
  //     if (wallet.type === 'lns') {
  //       connected = this.props.ledgerNanoSInfo.get('id') === wallet.deviceId;
  //     }
  //     return {
  //       name: wallet.name,
  //       type: wallet.type,
  //       address: wallet.address,
  //       assets: assets || [],
  //       totalBalance: usdValue,
  //       connected,
  //       loadingAssets: wallet.loadingBalances,
  //       loadingAssetsError: wallet.loadingBalancesError,
  //       isDecrypted: wallet.decrypted,
  //       mnemonic: wallet.decrypted ? wallet.decrypted.mnemonic : null,
  //       privateKey: wallet.decrypted ? wallet.decrypted.privateKey : null,
  //     };
  //   });
  // }

  // getBreakdown(wallets) {
  //   const tokenValues = {};
  //   const balanceSum = wallets.reduce((accumulator, current) => accumulator + current.totalBalance, 0);

  //   wallets.forEach((wallet) => {
  //     wallet.assets.forEach((asset) => {
  //       tokenValues[asset.name] = tokenValues[asset.name] || { value: 0 };
  //       tokenValues[asset.name].value += asset.amount * parseFloat(asset.price.USD);
  //       tokenValues[asset.name].color = asset.color;
  //     });
  //   });

  //   const breakdown = Object.keys(tokenValues).map((token) => ({
  //     label: token,
  //     percentage: (tokenValues[token].value / balanceSum) * 100,
  //     color: tokenValues[token].color,
  //   }));

  //   return { balanceSum, breakdown };
  // }

  // handleCardClick(card) {
  //   const { history } = this.props;
  //   history.push(`/wallet/${card.address}`);
  // }


  renderWalletCards() {
    const wallets = this.props.walletsWithInfo.toJS();
    return wallets.map((wallet) => (
      <WalletCardsCol
        span={12}
        key={wallet.name}
        xs={24}
        sm={24}
        lg={12}
      >
        <WalletItemCard
          name={wallet.name}
          totalBalance={wallet.balances.total.usd}
          balancesLoading={wallet.balances.loading}
          address={wallet.address}
          type={wallet.type}
          connected={wallet.type === 'lns' ? this.props.ledgerNanoSInfo.get('id') === wallet.deviceId : null}
          assets={wallet.balances.assets}
          mnemonic={wallet.mnemonic}
          privateKey={wallet.privateKey}
          isDecrypted={!!wallet.decrypted}
          showDecryptWalletModal={() => this.props.showDecryptWalletModal(wallet.name)}
          setCurrentWallet={() => this.props.setCurrentWallet(wallet.address)}
          handleCardClick={() => this.handleCardClick(wallet)}
          walletList={wallets}
          deleteWallet={() => this.props.deleteWallet(wallet.address)}
        />
      </WalletCardsCol>
    ));
  }

  render() {
    // const { walletList } = this.props;
    // const walletCards = this.getWalletCardsData(walletList);
    // const summary = this.getBreakdown(walletCards);
    return (
      <div>{this.renderWalletCards()}</div>
      // <Wrapper>
      //   <Row gutter={16}>
      //     <Col span={16} xs={24} md={16}>
      //       <SectionHeading>All Wallets</SectionHeading>
      //       <Row type="flex" align="top" gutter={16}>
      //         {this.renderWalletItems(walletCards)}
      //       </Row>
      //     </Col>
      //     <Col span={8} xs={24} md={8}>
      //       {
      //         <Breakdown
      //           data={summary.breakdown}
      //           value={summary.balanceSum}
      //         />
      //       }
      //     </Col>
      //   </Row>
      // </Wrapper>
    );
  }
}

WalletsOverview.propTypes = {
  showDecryptWalletModal: PropTypes.func.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  deleteWallet: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  totalBalances: PropTypes.object.isRequired,
  walletsWithInfo: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  walletsWithInfo: makeSelectWalletsWithInfo(),
  totalBalances: makeSelectTotalBalances(),
  ledgerNanoSInfo: makeSelectLedgerNanoSInfo(),
});

export function mapDispatchToProps(dispatch) {
  return {
    deleteWallet: (...args) => dispatch(deleteWallet(...args)),
    showDecryptWalletModal: (...args) => dispatch(showDecryptWalletModal(...args)),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsOverview);
