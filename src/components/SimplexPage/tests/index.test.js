import React from 'react';
import { shallow } from 'enzyme';

import SimplexPage from '../index';

describe('<SimplexPage />', () => {
  const props = {
    match: {
      path: '/wallet/0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0/buyeth',
    },
  };
  it('should render correctly when no errors', () => {
    const wrapper = shallow(<SimplexPage {...props} />);
    wrapper.setState({ error: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly on error', () => {
    const wrapper = shallow(<SimplexPage {...props} />);
    wrapper.setState({ error: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when couldn\'t get address from url', () => {
    const wrapper = shallow(<SimplexPage match={{ path: '1231' }} />);
    wrapper.setState({ error: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    const wrapper = shallow(<SimplexPage {...props} />);
    wrapper.setState({ error: false, loading: true });
    expect(wrapper).toMatchSnapshot();
  });
});
