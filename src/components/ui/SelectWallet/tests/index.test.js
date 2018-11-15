import React from 'react';
import { shallow } from 'enzyme';

import { walletsMock, walletsEmptyMock } from 'containers/WalletHoc/tests/mocks/selectors';

import SelectWallet from '../index';

describe('<SelectWallet />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SelectWallet wallets={walletsMock.toJS()} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there are no wallets', () => {
    const wrapper = shallow(<SelectWallet wallets={walletsEmptyMock.toJS()} />);
    expect(wrapper).toMatchSnapshot();
  });
});
