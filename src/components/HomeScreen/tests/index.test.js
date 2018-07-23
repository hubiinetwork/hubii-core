import React from 'react';
import { shallow } from 'enzyme';

import HomeScreen from '../index';

describe('<HomeScreen />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <HomeScreen />);
    expect(wrapper).toMatchSnapshot();
  });
});
