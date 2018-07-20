import React from 'react';
import { shallow } from 'enzyme';
import ImportWalletNameForm from '../index';

const wallet = {
  src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
  value: 'digitalBitbox1',
};

describe('<ImportWalletNameForm />', () => {
  it('should render correctly when loading is false', () => {
    const wrapper = shallow(<ImportWalletNameForm loading={false} wallet={wallet} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when loading is true', () => {
    const wrapper = shallow(<ImportWalletNameForm loading wallet={wallet} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});

