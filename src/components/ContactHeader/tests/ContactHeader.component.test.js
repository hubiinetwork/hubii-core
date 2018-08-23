import React from 'react';
import { shallow } from 'enzyme';

import ContactHeader from 'components/ContactHeader';

describe('ContactHeader', () => {
  const props = {
    title: 'some title',
    showSearch: true,
    onChange: jest.fn(),
  };

  it('should render correctly with common props', () => {
    const wrapper = shallow(
      <ContactHeader {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when showSearch === false', () => {
    const wrapper = shallow(
      <ContactHeader
        {...props}
        showSearch={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
