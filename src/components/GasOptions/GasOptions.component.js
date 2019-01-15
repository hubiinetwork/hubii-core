import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import {
  gweiToWei,
  gweiRegex,
  gasLimitRegex,
} from 'utils/wallet';
import { Panel } from 'components/ui/Collapse';
import { FormItem, FormItemLabel } from 'components/ui/Form';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';

import {
  AdvancedSettingsHeader,
} from './style';

export default class GasOptions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    const { defaultGasLimit, defaultGasPrice } = props;

    this.state = {
      gasPriceGweiInput: defaultGasPrice.toString(),
      gasPriceGwei: defaultGasPrice,
      gasLimitInput: defaultGasLimit,
      gasLimit: defaultGasLimit.toString(),
    };

    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  onFocusNumberInput(input) {
    if (this.state[input] === '0') {
      this.setState({ [input]: '' });
    }
  }

  onBlurNumberInput(input) {
    if (this.state[input] === '') {
      this.setState({ [input]: '0' });
    }
  }

  onFeeUpdated() {
    const { gasLimit, gasPriceGwei } = this.state;
    const fee = new BigNumber(gasLimit).times(gweiToWei(new BigNumber(gasPriceGwei)));
    this.props.onChange(fee, new BigNumber(gasLimit), new BigNumber(gasPriceGwei));
  }

  handleGasPriceChange(e) {
    const { value } = e.target;
    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ gasPriceGwei: new BigNumber('0'), gasPriceGweiInput: '' });
      this.onFeeUpdated();
    }

    // don't update if invalid regex
    // (numbers followed by at most 1 . followed by at most 9 decimals)
    if (!gweiRegex.test(value)) return;

    // don't update if a single gas is an infeasible amount of Ether
    // (> 100x entire circulating supply as of Aug 2018)
    if (!isNaN(value) && Number(value) > 10000000000000000000) return;

    // update the input (this could be an invalid number, such as '12.')
    this.setState({ gasPriceGweiInput: value });

    // update actual gwei if it's a real number
    if (!isNaN(value)) {
      this.setState({ gasPriceGwei: new BigNumber(value) });
    }
    this.onFeeUpdated();
  }

  handleGasLimitChange(e) {
    const { value } = e.target;
    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ gasLimitInput: '', gasLimit: 0 });
      this.onFeeUpdated();
    }

    // only allow whole numbers
    if (!gasLimitRegex.test(value)) return;

    // don't allow infeasible amount of gas
    // (gas limit per block almost never exeeds 10 million as of Aug 2018  )
    const ONE_HUNDRED_MILLION = 100000000;
    if (value > ONE_HUNDRED_MILLION) return;

    this.setState({ gasLimitInput: value, gasLimit: parseInt(value, 10) });
    this.onFeeUpdated();
  }

  handleOptionChange(type) {
    const { gasStatistics } = this.props;
    const suggestedGasPrice = gasStatistics[type] / 10;
    this.setState({ gasPriceGweiInput: suggestedGasPrice.toString(), gasPriceGwei: suggestedGasPrice });
    this.onFeeUpdated();
  }

  render() {
    const { gasStatistics, defaultGasLimit, defaultGasPrice, defaultOption, intl } = this.props;
    const { formatMessage } = intl;
    const { gasLimitInput, gasPriceGweiInput } = this.state;
    const disableInputs = defaultOption !== 'manual';
    const gasOptions = [
      { type: 'fast', name: `Fast <${Math.ceil(gasStatistics.fastWait)}min` },
      { type: 'average', name: `Average <${Math.ceil(gasStatistics.avgWait)}min` },
      { type: 'safeLow', name: `Slow <${Math.ceil(gasStatistics.safeLowWait)}min` },
    ];
    return (
      <Panel
        header={<AdvancedSettingsHeader>{formatMessage({ id: 'advanced_settings' })}</AdvancedSettingsHeader>}
        key="1"
      >
        <Select
          className="gas-options"
          defaultValue={defaultOption}
          onSelect={this.handleOptionChange}
          style={{ paddingLeft: '0.5rem' }}
        >
          {
            gasOptions.map((option) => (
              <Option value={option.type} key={option.type}>
                {option.name}
              </Option>
            ))
          }
        </Select>
        <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_price' })}</FormItemLabel>} colon={false}>
          <Input
            className="gas-price-input"
            min={0}
            defaultValue={defaultGasPrice.toString()}
            value={gasPriceGweiInput}
            onChange={this.handleGasPriceChange}
            onFocus={() => this.onFocusNumberInput('gasPriceGweiInput')}
            onBlur={() => this.onBlurNumberInput('gasPriceGweiInput')}
            disabled={disableInputs}
          />
        </FormItem>
        <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_limit' })}</FormItemLabel>} colon={false}>
          <Input
            className="gas-limit-input"
            defaultValue={defaultGasLimit.toString()}
            value={gasLimitInput}
            onChange={this.handleGasLimitChange}
            onFocus={() => this.onFocusNumberInput('gasLimitInput')}
            onBlur={() => this.onBlurNumberInput('gasLimitInput')}
          />
        </FormItem>
      </Panel>
    );
  }
}

GasOptions.propTypes = {
  intl: PropTypes.object.isRequired,
  gasStatistics: PropTypes.object.isRequired,
  defaultGasLimit: PropTypes.number.isRequired,
  defaultGasPrice: PropTypes.number.isRequired,
  defaultOption: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
