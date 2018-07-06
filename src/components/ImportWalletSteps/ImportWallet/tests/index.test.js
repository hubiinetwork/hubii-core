import React from 'react';
import { shallow } from 'enzyme';
import ImportWallet from '../index';

const walletData = [
  {
    src:
        'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    name: 'ledger',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    name: 'metamask',
  },
];

describe('<ImportWallet />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ImportWallet wallets={walletData} />);
    expect(wrapper).toMatchSnapshot();
  });
});
