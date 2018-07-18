import React from 'react';
import { shallow, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../../../../themes/darkTheme';
import ImportWalletPrivateKeyForm from '../index';

describe('<ImportWalletMnemonicForm />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ImportWalletPrivateKeyForm handleBack={() => {}} handleNext={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not renders any text', () => {
    const wrapper = render(
      <ThemeProvider theme={darkTheme}>
        <ImportWalletPrivateKeyForm handleBack={() => {}} handleNext={() => {}} />
      </ThemeProvider>);
    expect(wrapper.text()).toContain('');
  });
});
