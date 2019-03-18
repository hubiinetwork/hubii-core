/**
*
* ComboBoxSelect
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { isAddressMatch } from 'utils/wallet';
import { Option } from 'components/ui/Select';
import { StyledSelect } from './style';

class ComboBoxSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selectValue: '',
      notFoundMessage: null,
    };
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleFilterOption = this.handleFilterOption.bind(this);
  }

  componentWillMount() {
    this.setState({
      options: this.props.options,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.options.length !== prevProps.options.length) {
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        options: this.props.options,
      });
    }
  }

  // When the component is onBlurr'ed this function will be called. This function is important
  // as without it, if the user just clicks out without pressing "Enter" nothing will happen.
  onBlur() {
    const { selectValue } = this.state;
    const { options } = this.props;
    const value = selectValue.trim();
    // check if there is an exisiting contact for the input
    const existingContact = options.find((option) => option.name.toLowerCase() === value.toLowerCase() || isAddressMatch(option.value, selectValue));
    // set the input value to be a Invalid Addition Message as the input is not a valid input and nor is it an exisiting option
    if (!this.props.addInputValidator(value) && !existingContact) {
      this.setState({ selectValue: this.props.invalidAdditionMessage });
    } else if (existingContact) {
      this.setState({ selectValue: existingContact.name });
    } else {
    // this is for if there is a valid input but there is no existing option
      this.setState({
        selectValue: value,
      });
    }
    this.props.handleSelect(value);
  }

  onInputKeyDown(event) {
    const { options } = this.props;
    const value = event.target.value.trim();
    // basic check to see if it is an invalid input with no exisiting option
    if (event.key === 'Enter' && !this.props.addInputValidator(value) && options.every((option) => option.name.toLowerCase() !== value.toLowerCase())) {
      this.setState({ notFoundMessage: this.props.invalidAdditionMessage, selectValue: options[0] ? options[0].name : '' });
    } else if (event.key === 'Enter' && options.every((option) => !isAddressMatch(option.value, value) && option.name.toLowerCase() !== value)) {
      // will only this option if it is a valid input and it is not an existing option
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
    return option.props.children.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0 || isAddressMatch(option.props.value, input.trim());
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
  disabled: PropTypes.bool.isRequired,
  options: PropTypes.array,
  handleSelect: PropTypes.func.isRequired,
  addInputValidator: PropTypes.func.isRequired,
  invalidAdditionMessage: PropTypes.string.isRequired,
};

export default ComboBoxSelect;
