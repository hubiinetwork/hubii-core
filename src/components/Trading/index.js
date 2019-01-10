/**
*
* Trading
*
*/

import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';
// import PropTypes from 'prop-types';


import {
  Container,
  PriceChartWrapper,
  WrappedDepthChart,
  WrappedOrderBook,
  BookDepthChartWrapper,
  WrappedMarkets,
  WrappedOrders,
  Trading,
} from './style';


class TradingTab extends React.Component {
  constructor() {
    super();
    this.state = { selectedMarket: { primary: 'ETH', secondary: 'HBT' } };
    this.changeSelectedMarket = this.changeSelectedMarket.bind(this);
  }

  changeSelectedMarket(selectedMarket) {
    this.setState({ selectedMarket });
  }

  render() {
    const { selectedMarket } = this.state;
    return (
      <div>
        <Container>
          <PriceChartWrapper>
            <TradingViewWidget
              symbol="BITTREX:ETHUSDT"
              theme="Dark"
              autosize
              locale="en"
              toolbar_bg="rgb(26, 29, 39)"
            />
          </PriceChartWrapper>
          <WrappedMarkets
            selectedMarket={selectedMarket}
            changeSelectedMarket={this.changeSelectedMarket}
          />
          <Trading>Trading</Trading>
          <BookDepthChartWrapper>
            <WrappedDepthChart />
            <WrappedOrderBook selectedMarket={selectedMarket} />
          </BookDepthChartWrapper>
          <WrappedOrders />
        </Container>
      </div>
    );
  }
}

Trading.propTypes = {
  // priceHistory: PropTypes.object.isRequired,
  // latestPrice: PropTypes.object.isRequired,
  // currency: PropTypes.string.isRequired,
};

export default TradingTab;
