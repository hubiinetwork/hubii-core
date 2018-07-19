import React from 'react';
import { shallow, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../../../../themes/darkTheme';
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
  it('should not renders any text', () => {
    const wrapper = render(
      <ThemeProvider theme={darkTheme}>
        <ImportWalletMnemonicForm loading={false} handleBack={() => {}} handleNext={() => {}} />
      </ThemeProvider>);
    expect(wrapper.text()).toContain('');
  });
});
