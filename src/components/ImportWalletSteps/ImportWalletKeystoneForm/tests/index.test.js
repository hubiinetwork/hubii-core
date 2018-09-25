import React from 'react';
import { shallow } from 'enzyme';
import ImportWalletKeystoneForm from '../index';

describe('<ImportWalletKeystoneForm />', () => {
  it('should render correctly when loading is false', () => {
    const wrapper = shallow(<ImportWalletKeystoneForm loading={false} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when loading is true', () => {
    const wrapper = shallow(<ImportWalletKeystoneForm loading handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
