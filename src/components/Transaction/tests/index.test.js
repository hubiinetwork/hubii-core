import React from 'react';
import { shallow } from 'enzyme';

import { intl } from '../../../../__mocks__/react-intl';
import Transaction from '../index';

describe('<Transaction />', () => {
  const props = {
    time: new Date('January 09, 1995 05:19:09'),
    counterpartyAddress: '0x00',
    amount: '0.000000000000000001',
    fiatEquivilent: '$123.34 USD',
    symbol: 'UKG',
    confirmations: '204',
    type: 'sent',
    viewOnBlockExplorerClick: () => {},
    onChange: () => {},
    defaultOpen: false,
    intl,
  };

  it.only('should render correctly tx type sent', () => {
    const wrapper = shallow(
      <Transaction {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly tx type recieved', () => {
    const wrapper = shallow(
      <Transaction
        {...props}
        type="recieved"
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render contract creation events correctly', () => {
    const wrapper = shallow(
      <Transaction
        {...props}
        counterpartyAddress=""
      />);
    expect(wrapper).toMatchSnapshot();
  });
});
