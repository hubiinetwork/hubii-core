/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import WalletItemCard from '../../components/WalletItemCard';
import { SectionHeading } from '../../components/ui/SectionHeading';
import Breakdown from '../../components/Breakdown';

/**
 * This is the component shown when wallets overview tab is clicked
 * The props of this component are:
 * @param {IPropTypes.cards} props.cards Array of wallet cards.
 */
const WalletCardsCol = styled(Col)`
  margin-bottom: 1rem;
`;
class WalletsOverview extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cards !== this.props.cards) {

    }
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

  render() {
    const summary = this.getBreakdown(this.props.cards)
    return (
      <Row gutter={16}>
        <Col span={16} xs={24} md={16}>
          <SectionHeading>All Wallets</SectionHeading>
          <Row type="flex" align="top" gutter={16}>
            {this.renderWalletItems()}
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

  handleCardClick(address) {
    const { history } = this.props;
    history.push(`/wallet/${address}`);
  }

  renderWalletItems() {
    const { cards } = this.props;

    return cards.map((card, i) => (
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
}

WalletsOverview.propTypes = {
  cards: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default WalletsOverview;
