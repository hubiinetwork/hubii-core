import React from 'react';
import { shallow, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../../../../themes/darkTheme';
import ImportWalletMnemonicForm from '../index';

describe('<ImportWalletMnemonicForm />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ImportWalletMnemonicForm handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should not renders any text', () => {
    const wrapper = render(
      <ThemeProvider theme={darkTheme}>
        <ImportWalletMnemonicForm handleBack={() => {}} handleNext={() => {}} />
      </ThemeProvider>);
    expect(wrapper.text()).toContain('');
  });
});
