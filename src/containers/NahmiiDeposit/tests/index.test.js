import React from 'react';
import { shallow } from 'enzyme';
import { intl } from 'jest/__mocks__/react-intl';
import { currentNetworkMock } from 'containers/App/tests/mocks/selectors';
import {
  walletsWithInfoMock,
} from 'containers/WalletHoc/tests/mocks/selectors';
import {
  ledgerHocDisconnectedMock,
  ledgerHocConnectedMock,
} from 'containers/LedgerHoc/tests/mocks/selectors';

import {
  trezorHocConnectedMock,
  trezorHocDisconnectedMock,
} from 'containers/TrezorHoc/tests/mocks/selectors';

import {
  depositStatusNone,
  depositStatusEth,
  depositStatusApproving,
  depositStatusCompleting,
  depositStatusError,
} from 'containers/NahmiiHoc/tests/mocks/selectors';

import {
  pricesLoadedMock,
  pricesLoadingMock,
  pricesErrorMock,
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import { NahmiiDeposit } from '../index';

describe('<NahmiiDeposit />', () => {
  let props;
  beforeEach(() => {
    props = {
      currentWalletWithInfo: walletsWithInfoMock.get(0),
      prices: pricesLoadedMock,
      supportedAssets: supportedAssetsLoadedMock,
      nahmiiDeposit: () => {},
      goWalletDetails: () => {},
      intl,
      currentNetwork: currentNetworkMock,
      depositStatus: depositStatusNone,
      ledgerNanoSInfo: ledgerHocDisconnectedMock,
      trezorInfo: trezorHocDisconnectedMock,
    };
  });
  it('should render correctly when everything is loaded', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when ledger connected', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        ledgerNanoSInfo={ledgerHocConnectedMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when trezor connected', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        trezorInfo={trezorHocConnectedMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when prices are loading', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        prices={pricesLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when prices are errored', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        prices={pricesErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when depositing eth', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        depositStatus={depositStatusEth}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when approving a token deposit', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        depositStatus={depositStatusApproving}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when completing a token deposit', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        depositStatus={depositStatusCompleting}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when depositstatus is errored', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        depositStatus={depositStatusError}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets are loading', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        supportedAssets={supportedAssetsLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets are errored', () => {
    const wrapper = shallow(
      <NahmiiDeposit
        {...props}
        supportedAssets={supportedAssetsErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
