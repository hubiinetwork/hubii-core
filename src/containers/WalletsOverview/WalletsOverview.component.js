/* eslint-disable */
import React from 'react';
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

  render() {
    return (
      <Row gutter={16}>
        <Col span={16} xs={24} md={16}>
          <SectionHeading>All Wallets</SectionHeading>
          <Row type="flex" align="top" gutter={16}>
            {this.renderWalletItems()}
          </Row>
        </Col>
        <Col span={8} xs={24} md={8}>
          <Breakdown
            data={[
              { label: 'ICX', percentage: 16, color: '#3df5cd' },
              { label: 'EOS', percentage: 25.5, color: 'black' },
              { label: 'ETH', percentage: 28.5, color: '#627EEA' },
              {
                label: 'TRX',
                percentage: 20.69,
                color: 'rgba(255,255,255,0.5)',
              },
              { label: 'HBT', percentage: 16.8, color: '#0063A5' },
              { label: 'SNT', percentage: 10.54, color: '#5C6DED' },
              { label: 'SALT', percentage: 8.6, color: '#1BEEF4' },
              { label: 'OMG', percentage: 5.35, color: '#0666FF' },
              { label: 'REP', percentage: 4.2, color: '#602453' },
              { label: 'QSP', percentage: 2.24, color: '#454545' },
              { label: 'ZRX', percentage: 1.65, color: '#FFFFFF' },
            ]}
            value={24891.7}
          />
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
          // href={{
          //   pathname: '/wallet',
          //   query: { address: card.primaryAddress },
          // }}
          handleCardClick={this.handleCardClick}
        />
      </WalletCardsCol>
    ));
  }
}
export default WalletsOverview;
