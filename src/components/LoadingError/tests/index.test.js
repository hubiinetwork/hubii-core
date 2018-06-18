import React from 'react';
import { shallow } from 'enzyme';

import LoadingError from '../index';

describe('<LoadingError />', () => {
  it('should render correctly when unknown error message passed', () => {
    const wrapper = shallow(<LoadingError id={'12'} error={{ message: 'foo' }} pageType={'bar'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when Not Found error message is passed', () => {
    const wrapper = shallow(<LoadingError id={'12'} error={{ message: 'Not Found' }} pageType={'bar'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
