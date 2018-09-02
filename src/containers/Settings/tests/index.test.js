import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { SUPPORTED_NETWORKS } from 'config/constants';
import { Settings } from '../index';

describe('Settings', () => {
  const props = {
    onChangeNetwork: () => {},
    currentNetwork: 'ropsten',
    supportedNetworks: fromJS(SUPPORTED_NETWORKS),
  };
  it('should render correctly', () => {
    const wrapper = shallow(<Settings {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
