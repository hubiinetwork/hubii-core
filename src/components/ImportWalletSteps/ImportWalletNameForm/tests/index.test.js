import React from 'react';
import { shallow, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../../../../themes/darkTheme';
import ImportWalletNameForm from '../index';

const wallet = {
  src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
  value: 'digitalBitbox1',
};

describe('<ImportWalletNameForm />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ImportWalletNameForm wallet={wallet} handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct props', () => {
    const wrapper = shallow(<ImportWalletNameForm wallet={wallet} handleBack={() => {}} handleNext={() => {}} />);
    const wrapperProps = wrapper.instance().props;
    expect(wrapperProps.wallet).toEqual(wallet);
  });

  it('should not renders any text', () => {
    const wrapper = render(
      <ThemeProvider theme={darkTheme}>
        <ImportWalletNameForm wallet={wallet} handleBack={() => {}} handleNext={() => {}} />
      </ThemeProvider>);
    expect(wrapper.text()).toContain('');
  });
});

