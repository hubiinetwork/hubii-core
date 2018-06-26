import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import {
  Row,
  ETHtoDollar,
  Image,
  StyledLabel as OptGroupLabel,
  AdvanceSettingsHeader,
  Collapse,
  Panel,
} from './TransferForm.style';
import Input from '../ui/Input';
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
      icon: this.props.currencies[0].coin,
      priceInDollar: this.props.currencies[0].rateUSD,
      address: this.props.recipients[0].address,
      amount: this.props.currencies[0].amount,
      selectedToken: this.props.currencies[0],
      gasPrice: 30000,
      gasLimit: 21000,
    };
    this.state.ethInformation = this.props.currencies.find((currency) => currency.symbol === 'ETH');
    this.handleChange = this.handleChange.bind(this);
    this.handleIcon = this.handleIcon.bind(this);
    this.handleRecipient = this.handleRecipient.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
  }

  handleChange(e) {
    this.setState({ input: parseFloat(e.target.value) });
  }

  handleGasPriceChange(e) {
    this.setState({ gasPrice: parseFloat(e.target.value) });
  }

  handleGasLimitChange(e) {
    this.setState({ gasLimit: parseFloat(e.target.value) });
  }

  handleIcon(value) {
    for (let i = 0; i < this.props.currencies.length; i += 1) {
      if (this.props.currencies[i].coin === value) {
        this.setState({
          priceInDollar: this.props.currencies[i].rateUSD,
        });
      }
    }
    this.setState({ icon: value });
  }

  handleRecipient(value) {
    for (let i = 0; i < this.props.recipients.length; i += 1) {
      if (this.props.recipients[i].name === value) {
        this.setState({
          address: this.props.recipients[i].address,
        });
      }
    }
  }

  render() {
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
                  src={`../../../public/asset_images/${this.state.selectedToken.symbol}.svg`}
                  width="32px"
                  height="32px"
                  alt="logo"
                />
              </Image>
              <Select defaultValue={this.state.selectedToken.symbol} onSelect={this.handleIcon}>
                {this.props.currencies.map((currency) => (
                  <Option value={currency.symbol} key={currency.symbol}>
                    {currency.symbol}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Recipient</FormItemLabel>}
              colon={false}
              help={<HelperText left={this.state.address} />}
            >
              <Select
                defaultValue={this.props.recipients[0].name}
                recipient
                onSelect={this.handleRecipient}
              >
                <OptGroup label={<OptGroupLabel>Own Addresses</OptGroupLabel>}>
                  {this.props.recipients.map((recipient) => (
                    <Option value={recipient.name} key={recipient.name}>
                      {recipient.name}
                    </Option>
                  ))}
                </OptGroup>
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Amount</FormItemLabel>}
              colon={false}
              help={<HelperText left={(this.state.input * parseFloat(this.state.selectedToken.price.USD)).toLocaleString('en')} right="USD" />}
            >
              <Input onChange={this.handleChange} type="number" />
            </FormItem>
            <Collapse bordered={false} defaultActiveKey={['2']}>
              <Panel
                header={<AdvanceSettingsHeader>Advanced Settings</AdvanceSettingsHeader>}
                key="1"
              >
                <FormItem
                  label={<FormItemLabel>Gas Price</FormItemLabel>}
                  colon={false}
                  help={<HelperText left={((this.state.gasPrice / (10 ** 18)) * parseInt(this.state.ethInformation.price.USD, 10)).toString()} right="USD" />}
                >
                  <Input defaultValue={this.state.gasPrice} onChange={this.handleGasPriceChange} type="number" />
                </FormItem>
                <FormItem label={<HelperText left="Gas Limit" />} colon={false}>
                  <Input defaultValue={this.state.gasLimit} onChange={this.handleGasLimitChange} type="number" />
                </FormItem>
              </Panel>
            </Collapse>
            <ETHtoDollar>
              1 {this.state.selectedToken.symbol} = ${parseFloat(this.state.selectedToken.price.USD).toLocaleString('en')}
            </ETHtoDollar>
          </Form>
        </Col>
        <Col xl={6} sm={22}>

          <TransferDescription
            totalUsd={0}
            transactionFee={(this.state.gasPrice * this.state.gasLimit) / (10 ** 18)}
            amountToSend={this.state.input}
            recipient={'Jacobo'}
            totalAmount={parseInt(this.state.selectedToken.balance, 10) / (10 ** this.state.selectedToken.decimals)}
            selectedToken={this.state.selectedToken}
            ethInformation={this.state.ethInformation}
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
  // gasPrice: PropTypes.number,
  // gasPriceRate: PropTypes.number,
};
