import React from 'react';
import { shallow } from 'enzyme';
import ImportWalletPrivateKeyForm from '../index';

describe('<ImportWalletMnemonicForm />', () => {
  it('should render correctly when loading is false', () => {
    const wrapper = shallow(<ImportWalletPrivateKeyForm loading={false} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading is true', () => {
    const wrapper = shallow(<ImportWalletPrivateKeyForm loading handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
