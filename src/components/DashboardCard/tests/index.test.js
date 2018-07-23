import React from 'react';
import { shallow } from 'enzyme';
import { getAbsolutePath } from 'utils/electron';

import DashboardCard from '../DashboardCard.component';

describe('<DashboardCard />', () => {
  it('should render correctly when passed an antd icon type', () => {
    const wrapper = shallow(
      <DashboardCard iconType="setting" title="Settings" />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when passed an icon src', () => {
    const wrapper = shallow(
      <DashboardCard iconSrc={getAbsolutePath('public/images/dex-icon-green.png')} title="DEX" />);
    expect(wrapper).toMatchSnapshot();
  });
});
