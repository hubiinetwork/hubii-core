import React from 'react';
import { shallow } from 'enzyme';

import { intl } from 'jest/__mocks__/react-intl';
import HomeScreen from '../index';

describe('<HomeScreen />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <HomeScreen intl={intl} />);
    expect(wrapper).toMatchSnapshot();
  });
});
