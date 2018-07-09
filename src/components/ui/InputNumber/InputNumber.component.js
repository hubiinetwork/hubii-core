import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

export default class InputNumber extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.minValue,
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    const { minValue, maxValue } = this.props;

    if (event.target.value < minValue || event.target.value > maxValue) {
      return;
    }
    this.setState({
      value: event.target.value,
    });
  }
  render() {
    const { ...rest } = this.props;
    return (
      <Input
        value={this.state.value}
        onChange={this.onChange}
        type={'number'}
        {...rest}
      />
    );
  }
  }

InputNumber.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
};

