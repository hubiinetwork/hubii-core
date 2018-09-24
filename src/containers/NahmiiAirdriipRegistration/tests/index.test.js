import React from 'react';
import { shallow } from 'enzyme';

import { ledgerHocConnectedMock } from 'containers/LedgerHoc/tests/mocks/selectors';
import { trezorHocConnectedMock } from 'containers/TrezorHoc/tests/mocks/selectors';
import {
  walletsMock,
  walletsWithInfoMock,
  walletsWithInfoEmptyMock,
  currentWalletNoneMock,
  currentWalletLnsMock,
  currentWalletSoftwareMock,
} from 'containers/WalletHoc/tests/mocks/selectors';

import { nahmiiAirdriipRegistrationMock } from './mocks/selectors';

import {
  NahmiiAirdriipRegistration,
  Start,
  CoreAddressRegistrationForm,
  ManualRegistrationForm,
} from '../index';

describe('<NahmiiAirdriipRegistration />', () => {
  let props;
  describe('Root', () => {
    beforeEach(() => {
      props = {
        changeStage: () => {},
        setCurrentWallet: () => {},
        wallets: walletsMock,
        currentWalletWithInfo: walletsWithInfoMock.get(0),
        notify: () => {},
        register: () => {},
        ledgerInfo: ledgerHocConnectedMock,
        trezorInfo: trezorHocConnectedMock,
        store: nahmiiAirdriipRegistrationMock,
        changeManualAddress: () => {},
        changeManualSignedMessage: () => {},
      };
    });
    it('should render correctly in start stage', () => {
      const wrapper = shallow(<NahmiiAirdriipRegistration {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly in register-arbitrary stage', () => {
      const wrapper = shallow(
        <NahmiiAirdriipRegistration
          {...props}
          store={nahmiiAirdriipRegistrationMock.set('stage', 'register-arbitrary')}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly in register-imported stage', () => {
      const wrapper = shallow(
        <NahmiiAirdriipRegistration
          {...props}
          store={nahmiiAirdriipRegistrationMock.set('stage', 'register-imported')}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when registering', () => {
      const wrapper = shallow(
        <NahmiiAirdriipRegistration
          {...props}
          store={nahmiiAirdriipRegistrationMock.set('registering', true)}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });


  describe('Start', () => {
    beforeEach(() => {
      props = {
        changeStage: () => {},
      };
    });
    it('should render correctly', () => {
      const wrapper = shallow(<Start {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
    it('should contain buttons that call the changeStage function', () => {
      const changeStageSpy = jest.fn();
      const wrapper = shallow(
        <Start
          {...props}
          changeStage={changeStageSpy}
        />
        );
      const noBtn = wrapper.find('style__StyledButtonTall').at(0);
      const yesBtn = wrapper.find('style__StyledButtonTall').at(1);
      expect(changeStageSpy).toHaveBeenCalledTimes(0);
      noBtn.simulate('click');
      expect(changeStageSpy).toHaveBeenCalledTimes(1);
      yesBtn.simulate('click');
      expect(changeStageSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('CoreAddressRegistrationForm', () => {
    beforeEach(() => {
      props = {
        currentWalletWithInfo: currentWalletLnsMock,
        setCurrentWallet: () => {},
        wallets: walletsMock,
      };
    });
    it('should render correctly when a hardware wallet is selected', () => {
      const wrapper = shallow(<CoreAddressRegistrationForm {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when a software wallet is selected', () => {
      const wrapper = shallow(
        <CoreAddressRegistrationForm
          {...props}
          currentWalletWithInfo={currentWalletSoftwareMock}
        />
        );
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when there are no wallets', () => {
      const wrapper = shallow(
        <CoreAddressRegistrationForm
          {...props}
          wallets={walletsWithInfoEmptyMock}
          currentWalletWithInfo={currentWalletNoneMock}
        />
        );
      expect(wrapper).toMatchSnapshot();
    });
    it('should call setCurrentWallet correctly', () => {
      const setCurrentWalletSpy = jest.fn();
      const wrapper = shallow(
        <CoreAddressRegistrationForm
          {...props}
          setCurrentWallet={setCurrentWalletSpy}
        />
        );
      const selectWalletWrapper = wrapper.find('SelectWallet');
      expect(setCurrentWalletSpy).toHaveBeenCalledTimes(0);
      selectWalletWrapper.simulate('change', { target: { value: 'wallet123' } });
      expect(setCurrentWalletSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ManualRegistrationForm', () => {
    beforeEach(() => {
      props = {
        changeManualAddress: () => {},
        changeManualSignedMessage: () => {},
        notify: () => {},
      };
    });
    it('should render correctly', () => {
      const wrapper = shallow(<ManualRegistrationForm {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
    it('should correctly call the notify function when copy to clipboard is clicked', () => {
      const notifySpy = jest.fn();
      const wrapper = shallow(
        <ManualRegistrationForm
          {...props}
          notify={notifySpy}
        />
      );
      expect(notifySpy).toHaveBeenCalledTimes(0);
      wrapper.find('CopyToClipboard').childAt(0).simulate('click');
      expect(notifySpy).toHaveBeenCalledTimes(1);
    });
    it('should correctly call the field change functions', () => {
      const changeManualAddressSpy = jest.fn();
      const changeManualSignedMessageSpy = jest.fn();
      const wrapper = shallow(
        <ManualRegistrationForm
          {...props}
          changeManualAddress={changeManualAddressSpy}
          changeManualSignedMessage={changeManualSignedMessageSpy}
        />
      );
      expect(changeManualAddressSpy).toHaveBeenCalledTimes(0);
      wrapper
        .find({ placeholder: 'Ethereum address' })
        .simulate('change', { target: { value: '0x00000' } });
      expect(changeManualAddressSpy).toHaveBeenCalledTimes(1);

      expect(changeManualSignedMessageSpy).toHaveBeenCalledTimes(0);
      wrapper
        .find({ placeholder: 'Signed KECCAK-256 hash hex' })
        .simulate('change', { target: { value: '0x00000' } });
      expect(changeManualSignedMessageSpy).toHaveBeenCalledTimes(1);
    });
  });
});
