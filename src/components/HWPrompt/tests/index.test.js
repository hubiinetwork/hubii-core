import React from 'react';
import { shallow } from 'enzyme';

import {
  trezorHocConnectedMock,
  trezorHocDisconnectedMock,
  trezorHocConfOnDeviceMock,
} from 'containers/TrezorHoc/tests/mocks/selectors';

import {
  ledgerHocDisconnectedMock,
  ledgerHocConfOnDeviceMock,
  ledgerHocConnectedAppNotOpenMock,
  ledgerHocConnectedMock,
} from 'containers/LedgerHoc/tests/mocks/selectors';

import { intl } from '../../../../__mocks__/react-intl';
import HWPrompt from '../index';

describe('<HWPrompt />', () => {
  const props = {
    deviceType: 'lns',
    ledgerInfo: ledgerHocConnectedMock,
    trezorInfo: trezorHocConnectedMock,
    intl,
  };
  it('should render correctly in lns connected stage', () => {
    const wrapper = shallow(<HWPrompt {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in lns open device stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        ledgerInfo={ledgerHocConnectedAppNotOpenMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in lns connect stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        ledgerInfo={ledgerHocDisconnectedMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in lns conf on device stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        ledgerInfo={ledgerHocConfOnDeviceMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in trezor connect stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        deviceType="trezor"
        trezorInfo={trezorHocDisconnectedMock}
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in trezor conf on device stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        deviceType="trezor"
        trezorInfo={trezorHocConfOnDeviceMock}
      />);
    expect(wrapper).toMatchSnapshot();
  });
});
