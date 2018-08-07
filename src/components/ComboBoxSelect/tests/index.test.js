import React from 'react';
import { shallow } from 'enzyme';

import ComboBoxSelect from '../index';

describe('<ComboBoxSelect />', () => {
  const params = {
    disabled: false,
    options: [
      {
        name: 'mike',
        value: '0x324234',
      },
      {
        name: 'jake',
        value: '0x444224',
      },
    ],
    handleSelect: jest.fn(),
    addInputValidator: jest.fn(),
    invalidAdditionMessage: 'message',
  };
  let wrapper;
  let instance;
  beforeEach(() => {
    wrapper = shallow(<ComboBoxSelect {...params} />);
    instance = wrapper.instance();
    instance.setState({
      options: [
        {
          name: 'mike',
          value: '0x324234',
        },
        {
          name: 'jake',
          value: '0x444224',
        },
      ],
      selectValue: 'mike',
      notFoundMessage: 'Not Found',
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should correctly render', () => {
    expect(wrapper).toMatchSnapshot();
  });
  describe('#componentWillReceiveProps', () => {
    it('should update the options if the props have changed', () => {
      const newOptions = [
        {
          name: 'mike',
          value: '0x324234',
        },
      ];
      instance.componentWillReceiveProps({ options: newOptions });
      expect(instance.state.options).toEqual(newOptions);
    });
  });
  describe('#onBlur', () => {
    it('should provide an error message if there is an invalid input', () => {
      instance.setState({
        selectValue: 'no one',
      });
      instance.props.addInputValidator.mockReturnValueOnce(false);
      instance.onBlur();
      expect(instance.state.selectValue).toEqual(instance.props.invalidAdditionMessage);
      expect(instance.props.handleSelect).toHaveBeenCalledTimes(1);
    });
    it('should display the relevant option name in the input if the associated value is used', () => {
      instance.setState({
        selectValue: '0x324234',
      });
      const expectedSelectValue = 'mike';
      instance.props.addInputValidator.mockReturnValueOnce(true);
      instance.onBlur();
      expect(instance.state.selectValue).toEqual(expectedSelectValue);
      expect(instance.props.handleSelect).toHaveBeenCalledTimes(1);
    });
    it('should display the selected value if it is a valid input but not an option', () => {
      instance.setState({
        selectValue: '0x324sadasd234',
      });
      const expectedSelectValue = '0x324sadasd234';
      instance.props.addInputValidator.mockReturnValueOnce(true);
      instance.onBlur();
      expect(instance.state.selectValue).toEqual(expectedSelectValue);
      expect(instance.props.handleSelect).toHaveBeenCalledTimes(1);
    });
    it('should display the relevant name, if the input is the relevant name option', () => {
      instance.setState({
        selectValue: 'Mike',
      });
      const expectedSelectValue = 'mike';
      instance.props.addInputValidator.mockReturnValueOnce(false);
      instance.onBlur();
      expect(instance.state.selectValue).toEqual(expectedSelectValue);
      expect(instance.props.handleSelect).toHaveBeenCalledTimes(1);
    });
  });
  describe('#handleSelect', () => {
    it('should set the selectValue state, and call the this.props.handleSelect function', () => {
      const value = 'mike';
      instance.handleSelect(value);
      expect(instance.state.selectValue).toEqual(value);
      expect(instance.props.handleSelect).toHaveBeenCalledTimes(1);
    });
  });
  describe('#onInputKeyDown', () => {
    it('should provide invalid message if key inputted is \'Enter\' and the input is invalid', () => {
      const event = {
        target: {
          value: 'hello',
        },
        key: 'Enter',
      };
      instance.props.addInputValidator.mockReturnValueOnce(false);
      instance.onInputKeyDown(event);
      expect(instance.state.notFoundMessage).toEqual(instance.props.invalidAdditionMessage);
    });
    it('should add option if when \'Enter\' the input is valid', () => {
      const event = {
        target: {
          value: '0x123213',
        },
        key: 'Enter',
      };
      const newOptions = [
        {
          name: 'mike',
          value: '0x324234',
        },
        {
          name: 'jake',
          value: '0x444224',
        },
        {
          name: '0x123213',
          value: '0x123213',
        },
      ];
      instance.props.addInputValidator.mockReturnValueOnce(true);
      instance.onInputKeyDown(event);
      expect(instance.state.options).toEqual(newOptions);
    });
  });
  describe('#handleFilterOption', () => {
    const option = {
      props: {
        children: 'mike',
        value: '0x32324',
      },
    };
    it('should return true if the associated option name matches the input', () => {
      const input = 'mike';
      const expectedResult = true;
      expect(instance.handleFilterOption(input, option)).toEqual(expectedResult);
    });
    it('should return true if the associated option value matches the input', () => {
      const input = '0x32324';
      const expectedResult = true;
      expect(instance.handleFilterOption(input, option)).toEqual(expectedResult);
    });
    it('should return false if the associated option name or value does not match the input', () => {
      const input = '0xasdasd32324';
      const expectedResult = false;
      expect(instance.handleFilterOption(input, option)).toEqual(expectedResult);
    });
  });
});
