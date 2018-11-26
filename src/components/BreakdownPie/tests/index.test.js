import React from 'react';
import { shallow } from 'enzyme';

import { intl } from 'jest/__mocks__/react-intl';

import {
  totalBalancesErrorMock,
  totalBalancesLoadingMock,
  totalBalancesLoadedMock,
} from 'containers/WalletHoc/tests/mocks/selectors';

import {
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import BreakdownPie from '../index';

describe('BreakdownPie', () => {
  const props = {
    totalBalances: totalBalancesLoadedMock,
    supportedAssets: supportedAssetsLoadedMock,
    intl,
  };

  it('should render correctly with all props loaded', () => {
    const wrapper = shallow(
      <BreakdownPie
        {...props}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when totalbalances are loading', () => {
    const wrapper = shallow(
      <BreakdownPie
        {...props}
        totalBalances={totalBalancesLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when totalBalances are errored', () => {
    const wrapper = shallow(
      <BreakdownPie
        {...props}
        totalBalances={totalBalancesErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets are loading', () => {
    const wrapper = shallow(
      <BreakdownPie
        {...props}
        supportedAssets={supportedAssetsLoadingMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when supportedAssets are errored', () => {
    const wrapper = shallow(
      <BreakdownPie
        {...props}
        supportedAssets={supportedAssetsErrorMock}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
