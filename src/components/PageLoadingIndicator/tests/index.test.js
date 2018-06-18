import React from 'react';
import { shallow } from 'enzyme';

import PageLoadingIndicator from '../index';

describe('<PageLoadingIndicator />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<PageLoadingIndicator id={'12'} pageType={'FooPage'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
