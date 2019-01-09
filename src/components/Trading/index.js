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
  DepthChart,
  WrappedOrderBook,
  BookDepthChartWrapper,
  Markets,
  History,
  Trading,
} from './style';


const TradingTab = () => (
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
      <Markets>Markets</Markets>
      <Trading>Trading</Trading>
      <BookDepthChartWrapper>
        <DepthChart>Depth Chart</DepthChart>
        <WrappedOrderBook primary="ETH" secondary="HBT" />
      </BookDepthChartWrapper>
      <History>History</History>
    </Container>
  </div>
  );

Trading.propTypes = {
  // priceHistory: PropTypes.object.isRequired,
  // latestPrice: PropTypes.object.isRequired,
  // currency: PropTypes.string.isRequired,
};

export default TradingTab;
