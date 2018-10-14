import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { SUPPORTED_NETWORKS } from 'config/constants';
import { currentNetworkMock } from 'containers/App/tests/mocks/selectors';
import { Settings } from '../index';
import {intl} from '../../../../__mocks__/react-intl'

describe('Settings', () => {
  const props = {
    onChangeNetwork: () => {},
    onChangeLocale: () => {},
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
