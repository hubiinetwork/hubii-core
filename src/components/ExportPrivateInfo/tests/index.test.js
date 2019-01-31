import React from 'react';
import { shallow } from 'enzyme';
import ExportPrivateInfo from 'components/ExportPrivateInfo';
import { decryptedSoftwareWallet1Mock, decryptedSoftwareWallet2Mock } from 'containers/WalletHoc/tests/mocks';
describe('<ExportPrivateInfo/>', () => {
  const onExit = jest.fn();
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ExportPrivateInfo
        onExit={onExit}
        privateKey={decryptedSoftwareWallet1Mock.getIn(['decrypted', 'privateKey'])}
        mnemonic={decryptedSoftwareWallet1Mock.getIn(['decrypted', 'mnemonic'])}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render <ExportPrivateInfo/> correctly and when there is a mnemonic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render <ExportPrivateInfo/> correctly and when there is not a mnemonic', () => {
    wrapper = shallow(
      <ExportPrivateInfo
        onExit={onExit}
        privateKey={decryptedSoftwareWallet2Mock.getIn(['decrypted', 'privateKey'])}
        mnemonic={decryptedSoftwareWallet2Mock.getIn(['decrypted', 'mnemonic'])}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('when the exit button is clicked the onExit function is run', () => {
    const button = wrapper.find('#exit');
    button.simulate('click');
    expect(onExit).toHaveBeenCalledTimes(1);
  });
  describe('showNotification function', () => {
    it('should run the showNoftification function when the Icon to copy a wallet mnemonic is clicked', () => {
      const button = wrapper.find('#mnemonic');
      if (button) {
        const spy = jest.spyOn(wrapper.instance(), 'showNotification');
        button.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
    it('should run the showNoftification function when the Icon to copy a wallet private key is clicked', () => {
      const button = wrapper.find('#privateKey');
      const spy = jest.spyOn(wrapper.instance(), 'showNotification');
      button.simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
