import React from 'react';
import { shallow } from 'enzyme';
import ImportWalletKeystoreForm from '../index';

describe('<ImportWalletKeystoreForm />', () => {
  it('should render correctly when loading is false', () => {
    const wrapper = shallow(<ImportWalletKeystoreForm loading={false} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when loading is true', () => {
    const wrapper = shallow(<ImportWalletKeystoreForm loading handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
