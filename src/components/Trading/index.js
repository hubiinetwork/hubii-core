/**
*
* TradingTab
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
  WrappedTrade,
} from './style';


class TradingTab extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedMarket: { primary: 'ETH', secondary: 'HBT' },
      intendedTrade: {
        side: 'buy',
        type: 'market',
        volume: 0,
        price: 0,
      },
    };
    this.changeSelectedMarket = this.changeSelectedMarket.bind(this);
    this.changeIntendedTrade = this.changeIntendedTrade.bind(this);
  }

  changeSelectedMarket(selectedMarket) {
    this.setState({ selectedMarket });
  }

  changeIntendedTrade(intendedTrade) {
    this.setState({ intendedTrade });
  }

  executeTrade() {
    console.log('Execute trade');
  }

  render() {
    const { selectedMarket, intendedTrade } = this.state;
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
          <WrappedTrade
            intendedTrade={intendedTrade}
            changeIntendedTrade={this.changeIntendedTrade}
            executeTrade={this.executeTrade}
          />
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

TradingTab.propTypes = {
  // priceHistory: PropTypes.object.isRequired,
  // latestPrice: PropTypes.object.isRequired,
  // currency: PropTypes.string.isRequired,
};

export default TradingTab;
