import React from 'react';
import { shallow } from 'enzyme';

import { intl } from 'jest/__mocks__/react-intl';

import {
  pricesLoadedMock,
  supportedAssetsLoadedMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import {
  contacts,
  contactsEmpty,
} from 'containers/ContactBook/tests/mocks/selectors';

import {
  walletsWithInfoMock,
} from 'containers/WalletHoc/tests/mocks/selectors';

import { TransferForm } from '../index';

describe('TransferForm', () => {
  const props = {
    prices: pricesLoadedMock.toJS(),
    supportedAssets: supportedAssetsLoadedMock,
    currentWalletWithInfo: walletsWithInfoMock.get(0),
    recipients: contacts.toJS(),
    onSend: () => {},
    transfering: false,
    hwWalletReady: false,
    createContact: () => {},
    intl,
  };

  it('should render correctly in default state', () => {
    const wrapper = shallow(
      <TransferForm
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when contacts are empty', () => {
    const wrapper = shallow(
      <TransferForm
        {...props}
        recipients={contactsEmpty.toJS()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when transfering', () => {
    const wrapper = shallow(
      <TransferForm
        {...props}
        transfering
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when hwWalletReady', () => {
    const wrapper = shallow(
      <TransferForm
        {...props}
        hwWalletReady
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
