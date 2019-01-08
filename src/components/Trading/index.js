/**
*
* Trading
*
*/

import React from 'react';
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
      <PriceChartWrapper>Price Chart</PriceChartWrapper>
      <Markets>Markets</Markets>
      <Trading>Trading</Trading>
      <BookDepthChartWrapper>
        <DepthChart>Depth Chart</DepthChart>
        <WrappedOrderBook />
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
