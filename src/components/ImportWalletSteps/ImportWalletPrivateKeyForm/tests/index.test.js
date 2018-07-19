import React from 'react';
import { shallow, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../../../../themes/darkTheme';
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

  it('should not renders any text', () => {
    const wrapper = render(
      <ThemeProvider theme={darkTheme}>
        <ImportWalletPrivateKeyForm loading={false} handleBack={() => {}} handleNext={() => {}} />
      </ThemeProvider>);
    expect(wrapper.text()).toContain('');
  });
});
