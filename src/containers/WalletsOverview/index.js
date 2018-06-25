/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col } from 'antd';
import styled from 'styled-components';

import { makeSelectWallets } from 'containers/WalletManager/selectors';
import { loadWalletBalances, loadWallets } from 'containers/WalletManager/actions';
import { SectionHeading } from 'components/ui/SectionHeading';
import WalletItemCard from 'components/WalletItemCard';
import Breakdown from 'components/Breakdown';

import {convertWalletsList} from 'utils/wallet'

import {WalletCardsCol} from './style.js'

export class WalletsOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  componentDidMount() {
    this.props.loadWallets();
  }

  componentDidUpdate(prevProps) {
    const {wallets, loadWalletBalances} = this.props
    if (prevProps.wallets !== wallets) {
      let walletCardsData = convertWalletsList(wallets)
      walletCardsData.forEach(wallet => {
        if (!wallet.balances && !wallet.loadingBalancesError && !wallet.loadingBalances) {
          loadWalletBalances(wallet.name, `0x${wallet.encrypted.address}`)
        }
      })
    }
  }

  handleCardClick(address) {
    const { history } = this.props;
    history.push(`/wallet/${address}`);
  }

  getWalletCardsData (walletsState) {
    const {loadWalletBalances} = this.props
    return convertWalletsList(walletsState).map(wallet => {
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
  
  getBreakdown(wallets) {
    const tokenValues = {}
    const balanceSum = wallets.reduce((accumulator, current) => {
      return accumulator + current.totalBalance
    }, 0)

    wallets.forEach(wallet => {
      wallet.assets.forEach(asset => {
        tokenValues[asset.name] = tokenValues[asset.name] || {value: 0}
        tokenValues[asset.name].value += asset.amount * parseFloat(asset.price.USD)
        tokenValues[asset.name].color = asset.color
      })
    })

    const breakdown = Object.keys(tokenValues).map(token => {
      return {
        label: token,
        percentage: tokenValues[token].value / balanceSum * 100,
        color: tokenValues[token].color
      }
    })

    return {balanceSum, breakdown}
  }

  renderWalletItems(walletCards) {
    return walletCards.map((card, i) => (
      <WalletCardsCol
        span={12}
        key={`${card.name}-${i}`}
        xs={24}
        sm={24}
        lg={12}
      >
        <WalletItemCard
          name={card.name}
          totalBalance={card.totalBalance}
          primaryAddress={`${card.primaryAddress}`}
          type={card.type}
          assets={card.assets}
          handleCardClick={this.handleCardClick}
        />
      </WalletCardsCol>
    ));
  }

  render() {
    const {wallets} = this.props

    const walletCards = this.getWalletCardsData(wallets)
    const summary = this.getBreakdown(walletCards)
    return (
      <Row gutter={16}>
        <Col span={16} xs={24} md={16}>
          <SectionHeading>All Wallets</SectionHeading>
          <Row type="flex" align="top" gutter={16}>
            {this.renderWalletItems(walletCards)}
          </Row>
        </Col>
        <Col span={8} xs={24} md={8}>
          {summary.balanceSum && <Breakdown
            data={summary.breakdown}
            value={summary.balanceSum}
          />}
        </Col>
      </Row>
    );
  }
}

WalletsOverview.propTypes = {
  wallets: PropTypes.object.isRequired,
  loadWalletBalances: PropTypes.func.isRequired,
  loadWallets: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wallets: makeSelectWallets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
    loadWallets: () => dispatch(loadWallets()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsOverview);
