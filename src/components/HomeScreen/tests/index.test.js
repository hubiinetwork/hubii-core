import React from 'react';
import { shallow } from 'enzyme';

import HomeScreen from '../index';
import {intl} from '../../../../__mocks__/react-intl'

describe('<HomeScreen />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <HomeScreen intl={intl} />);
    expect(wrapper).toMatchSnapshot();
  });
});
