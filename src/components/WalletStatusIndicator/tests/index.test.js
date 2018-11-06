import React from 'react';
import { shallow } from 'enzyme';

import WalletStatusIndicator from '../index';

describe('<WalletStatusIndicator />', () => {
  it('should render correctly when wallet is connected hardware', () => {
    const wrapper = shallow(
      <WalletStatusIndicator
        active
        walletType={'hardware'}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when wallet is disconnected hardware', () => {
    const wrapper = shallow(
      <WalletStatusIndicator
        active={false}
        walletType={'hardware'}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when wallet is encrypted software', () => {
    const wrapper = shallow(
      <WalletStatusIndicator
        active={false}
        walletType={'software'}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when wallet is decrypted software', () => {
    const wrapper = shallow(
      <WalletStatusIndicator
        active
        walletType={'software'}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
