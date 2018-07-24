import React from 'react';
import { shallow } from 'enzyme';
import ImportWalletMnemonicForm from '../index';

describe('<ImportWalletMnemonicForm />', () => {
  it('should render correctly when loading is false', () => {
    const wrapper = shallow(<ImportWalletMnemonicForm loading={false} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when loading is true', () => {
    const wrapper = shallow(<ImportWalletMnemonicForm loading handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
