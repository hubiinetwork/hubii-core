import React from 'react';
import { shallow } from 'enzyme';

import TransactionHistoryItem from '../index';

describe('<TransactionHistoryItem />', () => {
  const props = {
    data: {
      address: '0x0000',
      time: new Date('January 09, 1995 05:19:09'),
      amount: '0.000000000000000001',
      txnId:
        '0x4891ee9bc872f5ea35b1dd3b7384bdc4a4c26f63ee7036f83568c8612603ed63',
      from: '60c482eB985EC9F3e364eEc0a904C44C23',
      fiatValue: '987.365',
      coin: 'UKG',
      confirmations: 204,
    },
  };

  it('should render correctly tx type recieved', () => {
    const wrapper = shallow(
      <TransactionHistoryItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly tx type sent', () => {
    const dataSend = { ...(props.data), from: null, to: '0x000' };
    const wrapper = shallow(
      <TransactionHistoryItem
        {...props}
        data={dataSend}
      />);
    expect(wrapper).toMatchSnapshot();
  });
});
