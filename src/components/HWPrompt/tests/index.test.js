import React from 'react';
import { shallow } from 'enzyme';

import HWPrompt from '../index';

describe('<HWPrompt />', () => {
  const props = {
    deviceType: 'lns',
    error: 'Ledger could not be detected',
  };
  it('should render correctly in lns connect stage', () => {
    const wrapper = shallow(<HWPrompt {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in lns openApp stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        error="some unknown error~~~~~~~~"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly in trezor connect stage', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        deviceType="trezor"
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when device is connected with no errors', () => {
    const wrapper = shallow(
      <HWPrompt
        {...props}
        error={null}
      />);
    expect(wrapper).toMatchSnapshot();
  });
});
