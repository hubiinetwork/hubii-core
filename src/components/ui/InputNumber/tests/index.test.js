import React from 'react';
import { shallow, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import InputNumber from '../index';
import darkTheme from '../../../../themes/darkTheme';

describe('<InputNumber />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<InputNumber handleChange={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct props', () => {
    const wrapper = shallow(<InputNumber minValue={20} maxValue={30} handleChange={() => {}} />);
    const wrapperProps = wrapper.instance().props;
    expect(wrapperProps.minValue).toEqual(20);
    expect(wrapperProps.maxValue).toEqual(30);
  });
  it('onchange should run', () => {
    const component = mount(
      <ThemeProvider theme={darkTheme}>
        <InputNumber handleChange={() => {}} />
      </ThemeProvider>
    );
    const input = component.find('.ant-input');
    input.simulate('change');
    expect(input.props().className).toHaveLength(9);
  });
  it('should render correctly', () => {
    const component = mount(
      <ThemeProvider theme={darkTheme}>
        <InputNumber handleChange={() => {}} />
      </ThemeProvider>
    );
    const input = component.find('.ant-input');
    expect(input.text()).toBe('');
  });
});
