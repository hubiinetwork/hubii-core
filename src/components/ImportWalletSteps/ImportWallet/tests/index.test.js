import React from 'react';
import { shallow, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../../../../themes/darkTheme';
import ImportWallet from '../index';

const walletData = [
  {
    src:
        'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask',
  },
  {
    src:
        'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox',
  },
  {
    src:
        'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger1',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask1',
  },
  {
    src:
        'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity1',
  },
];

describe('<ImportWallet />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ImportWallet wallets={walletData} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct props', () => {
    const wrapper = shallow(<ImportWallet wallets={walletData} />);
    const wrapperProps = wrapper.instance().props;
    expect(wrapperProps.wallets).toEqual(walletData);
  });

  it('should not render children when passed in', () => {
    const wrapper = shallow((
      <ImportWallet wallets={walletData} >
        <div className="unique" />
      </ImportWallet>
    ));
    expect(wrapper.contains(<div className="unique" />)).toEqual(false);
  });

  it('should not renders any text', () => {
    const wrapper = render(
      <ThemeProvider theme={darkTheme}>
        <ImportWallet wallets={walletData} />
      </ThemeProvider>);
    expect(wrapper.text()).toContain('');
  });
});
