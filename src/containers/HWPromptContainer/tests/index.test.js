import React from 'react';
import { shallow } from 'enzyme';

import {
  trezorHocConnectedMock,
} from 'containers/TrezorHoc/tests/mocks/selectors';

import {
  walletsWithInfoEmptyMock,
  walletsWithInfoMock,
} from 'containers/WalletHOC/tests/mocks/selectors';

import {
  ledgerHocConnectedMock,
} from 'containers/LedgerHoc/tests/mocks/selectors';

import { HWPromptContainer } from '../index';

// Write in tests when Trezor has been refactored
describe('<HWPromptContainer />', () => {
  const props = {
    currentWalletWithInfo: walletsWithInfoMock.get(0),
    ledgerInfo: ledgerHocConnectedMock,
    trezorInfo: trezorHocConnectedMock,
  };
  it('should render correctly without device type passed', () => {
    const wrapper = shallow(
      <HWPromptContainer
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly with device type passed', () => {
    const wrapper = shallow(
      <HWPromptContainer
        {...props}
        deviceType={'lns'}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly without device type passed and empty current wallet', () => {
    const wrapper = shallow(
      <HWPromptContainer
        {...props}
        currentWalletWithInfo={walletsWithInfoEmptyMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
