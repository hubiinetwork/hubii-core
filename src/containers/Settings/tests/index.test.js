import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { SUPPORTED_NETWORKS } from 'config/constants';
import { currentNetworkMock } from 'containers/App/tests/mocks/selectors';
import { intl } from 'jest/__mocks__/react-intl';
import { Settings } from '../index';

describe('Settings', () => {
  const props = {
    onChangeNetwork: () => {},
    onChangeLocale: () => {},
    onBatchExport: () => {},
    onBatchImport: () => {},
    onDecryptImport: () => {},
    currentNetwork: currentNetworkMock,
    supportedNetworks: fromJS(SUPPORTED_NETWORKS),
    locale: 'en',
    intl,
  };
  it('should render correctly', () => {
    const wrapper = shallow(<Settings {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
