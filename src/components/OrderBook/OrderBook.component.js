import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledTable,
  TitleLeft,
  TitleRight,
  PrimaryText,
  DangerText,
  SuccessText,
  AmountWrapper,
  SecondaryText,
} from './OrderBook.style';

const OrderBook = ({ data }) => {
  const sucessColumns = [{
    title: <div><TitleLeft>Price </TitleLeft><TitleRight>HBT</TitleRight></div>,
    dataIndex: 'priceHBT',
    key: 'priceHBT',
    render: (amount) => <SuccessText>{amount}</SuccessText>,
    width: '33.3%',
  },
  {
    title: <div><TitleLeft>Amount </TitleLeft><TitleRight>ETH</TitleRight></div>,
    dataIndex: 'amountETH',
    key: 'amountETH',
    render: (amount) => <PrimaryText>{amount}</PrimaryText>,
    width: '33.3%',
  },
  {
    title: <div><TitleLeft>Total </TitleLeft><TitleRight>HBT</TitleRight></div>,
    dataIndex: 'totalHBT',
    key: 'totalHBT',
    render: (amount) => <PrimaryText>{amount}</PrimaryText>,
    width: '33.3%',
  }];

  const dataSource = data.map(({ priceHBT, amountETH }, i) => ({
    key: i,
    priceHBT,
    amountETH,
    totalHBT: priceHBT * amountETH,
  }));
  const columns = sucessColumns.map((column) => ({ ...column }));
  columns[0].render = (amount) => <DangerText>{amount}</DangerText>;
  return (
    <div>
      <StyledTable
        dataSource={dataSource}
        pagination={false}
        columns={sucessColumns}
        size="small"
      />
      <AmountWrapper><SecondaryText>843.59 USD</SecondaryText></AmountWrapper>
      <StyledTable
        showHeader={false}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        size="small"
      />
    </div>
  );
};
OrderBook.propTypes = {
  /**
   * Antd table prop which contains data of the table
   */
  data: PropTypes.array,
};
export default OrderBook;
