import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

export default class InputNumber extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || props.min,
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    const { min, max } = this.props;
    const value = event.target.value;
    if (value < min || value > max) {
      return;
    }
    this.props.handleChange(event);
    this.setState({
      value: event.target.value,
    });
  }
  render() {
    const { min, max, defaultValue } = this.props;
    return (
      <Input
        value={this.state.value}
        onChange={this.onChange}
        min={min}
        max={max}
        type={'number'}
        defaultValue={defaultValue}
      />
    );
  }
}

InputNumber.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
};

