import React from 'react';
import { shallow } from 'enzyme';

import TransactionHistoryDetail from '../index';

describe('<TransactionHistoryDetail />', () => {
  const props = {
    address: '0x00000000028942',
    amount: '0.0011',
    txnId: '0xb2682160c482eB985EC9F3e364eEc0a904C44C2360c482eB985EC9F3e364eEc0a904C44C23',
    type: 'received',
    confirmations: 204,
    time: new Date('December 17, 1995 13:24:00'),
    fiatValue: '671.23',
  };
  it('should render type recieved correctly', () => {
    const wrapper = shallow(
      <TransactionHistoryDetail {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render type sent correctly', () => {
    const wrapper = shallow(
      <TransactionHistoryDetail
        {...props}
        type="sent"
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when tx pending', () => {
    const wrapper = shallow(
      <TransactionHistoryDetail
        {...props}
        confirmations={0}
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when only 1 confirmation', () => {
    const wrapper = shallow(
      <TransactionHistoryDetail
        {...props}
        confirmations={1}
      />);
    expect(wrapper).toMatchSnapshot();
  });
});
