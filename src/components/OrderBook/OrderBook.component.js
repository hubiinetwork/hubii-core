import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { TabPane } from '../ui/StriimTabs';
import {
  Heading,
  Tabs,
  Wrapper,
} from './OrderBook.style';
import OrderBookTable from './OrderBookTable';

const OrderBook = ({ incrementedData, decrementedData, amountUSD }) => (
  <Wrapper>
    <Heading>Order Book</Heading>
    <Tabs defaultActiveKey="1">
      <TabPane tab={<Icon type="arrow-down" style={{ color: 'green' }} />} key="1" style={{ color: 'white' }}>
        <OrderBookTable incrementedData={incrementedData} decrementedData={decrementedData} amountUSD={amountUSD} />
      </TabPane>
      <TabPane tab={<Icon type="arrow-up" style={{ color: 'red' }} />} key="2" style={{ color: 'white' }}>
        <OrderBookTable incrementedData={incrementedData} decrementedData={decrementedData} amountUSD={amountUSD} />
      </TabPane>
      <TabPane tab={<Icon type="apple" />} key="3" style={{ color: 'white' }}>
        <OrderBookTable incrementedData={incrementedData} decrementedData={decrementedData} amountUSD={amountUSD} />
      </TabPane>
    </Tabs>
  </Wrapper>
);

OrderBook.propTypes = {
  /**
   * Table data of incremented values
   */
  incrementedData: PropTypes.array,
  /**
   * Table data of decremented values
   */
  decrementedData: PropTypes.array,
  amountUSD: PropTypes.number,
};
export default OrderBook;
