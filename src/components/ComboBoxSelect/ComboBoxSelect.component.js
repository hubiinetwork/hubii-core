/**
*
* ComboBoxSelect
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { StyledSelect } from './ComboBoxSelect.style';
import { Option } from '../ui/Select';

class ComboBoxSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleFilterOption = this.handleFilterOption.bind(this);
    this.state = {
      options: [],
      selectValue: this.props.options[0] ? this.props.options[0].name : '',
      notFoundMessage: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      options: nextProps.options,
    });
  }

  onBlur() {
    const { selectValue } = this.state;
    const { options } = this.props;
    const value = selectValue.trim();
    const existingContact = options.find((option) => option.name.toLowerCase() === value.toLowerCase() || option.value === selectValue);
    if (!this.props.addInputValidator(value) && !existingContact) {
      this.setState({ selectValue: this.props.invalidAdditionMessage });
    } else if (existingContact) {
      this.setState({ selectValue: existingContact.name });
    } else {
      this.setState({
        selectValue: value,
      });
    }
    this.props.handleSelect(value);
  }

  onInputKeyDown(event) {
    const { options } = this.props;
    const value = event.target.value.trim();
    if (event.key === 'Enter' && !this.props.addInputValidator(value) && options.every((option) => option.name.toLowerCase() !== value.toLowerCase())) {
      this.setState({ notFoundMessage: this.props.invalidAdditionMessage, selectValue: options[0] ? options[0].name : '' });
    } else if (event.key === 'Enter' && options.every((option) => option.value !== value && option.name.toLowerCase() !== value)) {
      this.setState((prevState) => ({
        options: [...prevState.options, { name: value, value }],
      }));
    }
  }

  handleSelect(value) {
    this.setState({
      selectValue: value,
    });
    this.props.handleSelect(value);
  }

  handleFilterOption(input, option) {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0 || option.props.value === input.trim();
  }

  render() {
    const { disabled } = this.props;
    const { notFoundMessage, options } = this.state;
    return (
      <StyledSelect
        disabled={disabled}
        showSearch
        recipient
        onInputKeyDown={this.onInputKeyDown}
        onSearch={(value) => this.setState({ selectValue: value, notFoundMessage: value })}
        onSelect={this.handleSelect}
        notFoundContent={notFoundMessage}
        onBlur={this.onBlur}
        filterOption={(input, option) => this.handleFilterOption(input, option)}
        value={this.state.selectValue}
      >
        {options.map((option) => (
          <Option key={option.name} value={option.value}>
            {option.name}
          </Option>
        ))}
      </StyledSelect>
    );
  }
}

ComboBoxSelect.propTypes = {
  /**
   * Determines if the ComboBoxSelect is disabled
   */
  disabled: PropTypes.bool.isRequired,
  /**
   * Options are an array of object, where there must be a "name" and "value" field
   */
  options: PropTypes.array,
  /**
   * handles events onSelect
   */
  handleSelect: PropTypes.func.isRequired,
  /**
   * Input into select input validator
   */
  addInputValidator: PropTypes.func.isRequired,
  /**
   * Message if there is an invalid addition
   */
  invalidAdditionMessage: PropTypes.string.isRequired,
};

export default ComboBoxSelect;
