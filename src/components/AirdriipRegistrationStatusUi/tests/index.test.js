import React from 'react';
import { shallow } from 'enzyme';
import { intl } from 'jest/__mocks__/react-intl';

import AirdriipRegistrationStatusUi from '../index';

describe('<AirdriipRegistrationStatusUi />', () => {
  let props;
  beforeEach(() => {
    props = {
      loading: true,
      style: { marginBottom: '5px' },
      intl,
    };
  });
  it('should render correctly in loading state', () => {
    const wrapper = shallow(<AirdriipRegistrationStatusUi {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in registered state', () => {
    const wrapper = shallow(
      <AirdriipRegistrationStatusUi
        {...props}
        status="registered"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in error state', () => {
    const wrapper = shallow(
      <AirdriipRegistrationStatusUi
        {...props}
        status="Error: asdkjfasjdkl"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
