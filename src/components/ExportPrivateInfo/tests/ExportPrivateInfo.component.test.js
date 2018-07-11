import React from 'react';
import { shallow } from 'enzyme';
import ExportPrivateInfo from 'components/ExportPrivateInfo';

describe('<ExportPrivateInfo/>', () => {
  const wallet = {
    name: 'Wallet1',
    address: '0x3123123',
    privateKey: 'privateKey',
    mnemonic: 'the ball in my hand',
  };
  const onExit = jest.fn();
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ExportPrivateInfo
        name={wallet.name}
        address={wallet.address}
        onExit={onExit}
        privateKey={wallet.privateKey}
        mnemonic={wallet.mnemonic}
      />
    );
  });

  it('should render <ExportPrivateInfo/> correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('when the exit button is clicked the onExit function is run', () => {
    const button = wrapper.find('#exit');
    button.simulate('click');
    expect(onExit).toHaveBeenCalledTimes(1);
  });
  describe('showNotification function', () => {
    it('should run the showNoftification function when the Icon to copy a wallet name is clicked', () => {
      const button = wrapper.find('#name');
      const spy = jest.spyOn(wrapper.instance(), 'showNotification');
      button.simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should run the showNoftification function when the Icon to copy a wallet address is clicked', () => {
      const button = wrapper.find('#address');
      const spy = jest.spyOn(wrapper.instance(), 'showNotification');
      button.simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should run the showNoftification function when the Icon to copy a wallet mnemonic is clicked', () => {
      const button = wrapper.find('#mnemonic');
      const spy = jest.spyOn(wrapper.instance(), 'showNotification');
      button.simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should run the showNoftification function when the Icon to copy a wallet private key is clicked', () => {
      const button = wrapper.find('#privateKey');
      const spy = jest.spyOn(wrapper.instance(), 'showNotification');
      button.simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
