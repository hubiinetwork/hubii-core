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

const markets = {
  ETH: [
    {
      ticker: 'DAI',
      price: '0.035088',
      volume: '328399.90',
      change: 17.41,
    },
    {
      ticker: 'HBT',
      price: '0.035088',
      volume: '328399.90',
      change: 17.41,
    },
    {
      ticker: 'OMG',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
    {
      ticker: 'ZRX',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
  ],
  DAI: [
    {
      ticker: 'ZRX',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
    {
      ticker: 'OMG',
      price: '0.035088',
      volume: '328399.90',
      change: -17.41,
    },
  ],
};

const bids = [
  {
    price: '0.00029',
    amount: '1',
  },
  {
    price: '0.00028',
    amount: '1',
  },
  {
    price: '0.00027',
    amount: '1',
  },
  {
    price: '0.00026',
    amount: '1',
  },
  {
    price: '0.00025',
    amount: '1',
  },
  {
    price: '0.00024',
    amount: '1',
  },
  {
    price: '0.00003',
    amount: '2',
  },
  { price: '0.00002',
    amount: '5',
  },
  {
    price: '0.00001',
    amount: '1',
  },
];

const asks = [
  {
    price: '0.00033',
    amount: '2',
  },
  {
    price: '0.00034',
    amount: '2',
  },
  {
    price: '0.00035',
    amount: '2',
  },
  {
    price: '0.00036',
    amount: '2',
  },
  {
    price: '0.00037',
    amount: '2',
  },
  {
    price: '0.00038',
    amount: '2',
  },
  {
    price: '0.00039',
    amount: '2',
  },
  {
    price: '0.0004',
    amount: '2',
  },
  {
    price: '0.0005',
    amount: '5',
  },
];

const orderBook = { bids, asks };

class TradingTab extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedMarket: { primary: 'ETH', secondary: 'HBT' },
      intendedTrade: {
        side: 'buy',
        type: 'market',
        volume: '',
        price: '',
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
    console.log('Execute trade'); // eslint-disable-line
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
            markets={markets}
          />
          <WrappedTrade
            intendedTrade={intendedTrade}
            changeIntendedTrade={this.changeIntendedTrade}
            executeTrade={this.executeTrade}
            selectedMarket={selectedMarket}
            orderBook={orderBook}
          />
          <BookDepthChartWrapper>
            <WrappedDepthChart orderBook={orderBook} />
            <WrappedOrderBook orderBook={orderBook} selectedMarket={selectedMarket} />
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
