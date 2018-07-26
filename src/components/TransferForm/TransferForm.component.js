import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import { gweiToWei } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';
import { getAbsolutePath } from 'utils/electron';
import {
  Row,
  ETHtoDollar,
  Image,
  StyledLabel as OptGroupLabel,
  AdvanceSettingsHeader,
  Collapse,
  Panel,
} from './TransferForm.style';
import InputNumber from '../ui/InputNumber';
import Select, { Option, OptGroup } from '../ui/Select';
import { Form, FormItem, FormItemLabel } from '../ui/Form';
import HelperText from '../ui/HelperText';
import TransferDescription from '../TransferDescription';

// TODO: This component is buggy. Just merging because a lot of eslint issue have been resolved in this branch
export default class TransferForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      input: 0,
      priceInDollar: this.props.currencies[0].rateUSD,
      address: this.props.recipients[0] ? this.props.recipients[0].address : '',
      amount: this.props.currencies[0].amount,
      selectedToken: this.props.currencies[0],
      gasPriceGwei: 3,
      gasLimit: 21000,
    };
    this.state.ethInformation = this.props.currencies.find((currency) => currency.symbol === 'ETH');
    this.handleChange = this.handleChange.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.onSend = this.onSend.bind(this);
    this.handleRecipient = this.handleRecipient.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
  }

  onSend() {
    const { token, address, input, gasPriceGwei, gasLimit } = this.state;
    this.props.onSend(token, address, input, gweiToWei(gasPriceGwei), gasLimit);
  }

  handleChange(e) {
    const { value } = e.target;
    const input = parseFloat(isNaN(value) || value === '' ? 0 : value);
    this.setState({ input });
  }

  handleGasPriceChange(e) {
    this.setState({ gasPriceGwei: parseFloat(e.target.value) });
  }

  handleGasLimitChange(e) {
    this.setState({ gasLimit: parseFloat(e.target.value) });
  }

  handleTokenChange(newSymbol) {
    for (let i = 0; i < this.props.currencies.length; i += 1) {
      if (this.props.currencies[i].symbol === newSymbol) {
        this.setState({
          priceInDollar: this.props.currencies[i].rateUSD,
          selectedToken: this.props.currencies[i],
        });
      }
    }
  }

  handleRecipient(value) {
    this.setState({
      address: value,
    });
  }

  render() {
    const { selectedToken, address, gasLimit, input, gasPriceGwei, ethInformation } = this.state;
    const { currencies, recipients } = this.props;

    const totalBalance = selectedToken.balance;
    return (
      <Row gutter={24} justify="center">
        <Col xl={16} sm={22}>
          <Form>
            <FormItem
              label={<FormItemLabel>Select Currency</FormItemLabel>}
              colon={false}
            >
              <Image>
                <img
                  src={getAbsolutePath(`public/images/assets/${selectedToken.symbol}.svg`)}
                  width="32px"
                  height="32px"
                  alt="logo"
                />
              </Image>
              <Select defaultValue={selectedToken.symbol} onSelect={this.handleTokenChange}>
                {currencies.map((currency) => (
                  <Option value={currency.symbol} key={currency.symbol}>
                    {currency.symbol}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Recipient</FormItemLabel>}
              colon={false}
              help={<HelperText left={address} />}
            >
              <Select
                defaultValue={recipients[0] ? recipients[0].name : ''}
                recipient
                onSelect={this.handleRecipient}
              >
                <OptGroup label={<OptGroupLabel>Own Addresses</OptGroupLabel>}>
                  {this.props.recipients.map((recipient) => (
                    <Option value={recipient.address} key={recipient.address}>
                      {recipient.name}
                    </Option>
                  ))}
                </OptGroup>
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Amount</FormItemLabel>}
              colon={false}
              help={<HelperText left={formatFiat(input * parseFloat(selectedToken.value.usd), 'USD')} right="USD" />}
            >
              <InputNumber min={0} max={totalBalance} handleChange={this.handleChange} />
            </FormItem>
            <Collapse bordered={false} defaultActiveKey={['2']}>
              <Panel
                header={<AdvanceSettingsHeader>Advanced Settings</AdvanceSettingsHeader>}
                key="1"
              >
                <FormItem
                  label={<FormItemLabel>Gas Price (Gwei)</FormItemLabel>}
                  colon={false}
                >
                  <InputNumber min={0} defaultValue={gasPriceGwei} value={gasPriceGwei} handleChange={this.handleGasPriceChange} />
                </FormItem>
                <FormItem label={<FormItemLabel>Gas Limit</FormItemLabel>} colon={false}>
                  <InputNumber min={0} defaultValue={gasLimit} handleChange={this.handleGasLimitChange} />
                </FormItem>
              </Panel>
            </Collapse>
            <ETHtoDollar>
              {`1 ${selectedToken.symbol} = ${formatFiat(parseFloat(selectedToken.value.usd), 'USD')}`}
            </ETHtoDollar>
          </Form>
        </Col>
        <Col xl={6} sm={22}>
          <TransferDescription
            totalUsd={0}
            transactionFee={(gasPriceGwei * gasLimit) / (10 ** 9)}
            amountToSend={input}
            recipient={address}
            totalAmount={totalBalance}
            selectedToken={selectedToken}
            ethInformation={ethInformation}
            onSend={this.onSend}
            onCancel={this.props.onCancel}
            transfering={this.props.transfering}
          />
        </Col>
      </Row>
    );
  }
}
TransferForm.propTypes = {
  address: PropTypes.string,
  currencies: PropTypes.array.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
  })),
  onSend: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  transfering: PropTypes.bool,
};
