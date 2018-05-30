import React from 'react';
import { Col } from 'antd';
import {
  Row,
  ETHtoDollar,
  Image,
  StyledLabel as OptGroupLabel
} from './TransferForm.style';
import Input from '../ui/Input';
import Select, { Option, OptGroup } from '../ui/Select';
import { Form, FormItem, FormItemLabel } from '../ui/Form';
import HelperText from '../ui/HelperText';
import AdvanceSettings from './AdvanceSettings';

export default class TransferForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      input: 0,
      icon: this.props.currencies[0].name,
      priceInDollar: this.props.currencies[0].priceInDollar,
      address: this.props.recipients[0].address
    };
  }

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  handleIcon = (value, option) => {
    for (var i = 0; i < this.props.currencies.length; i++) {
      if (this.props.currencies[i].name === value) {
        this.setState({
          priceInDollar: this.props.currencies[i].priceInDollar
        });
      }
    }
    this.setState({ icon: value });
  };

  handleRecipient = (value, option) => {
    for (var i = 0; i < this.props.recipients.length; i++) {
      if (this.props.recipients[i].name === value) {
        this.setState({
          address: this.props.recipients[i].address
        });
      }
    }
  };

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
                  src={`../../../public/asset_images/${this.state.icon}.svg`}
                  width="32px"
                  height="32px"
                />
              </Image>
              <Select defaultValue={this.state.icon} onSelect={this.handleIcon}>
                {this.props.currencies.map(currency => (
                  <Option value={currency.name} key={currency.name}>
                    {currency.name}
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
                  {this.props.recipients.map(recipient => (
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
              help={<HelperText left="0.00" right="USD" />}
            >
              <Input onChange={this.handleChange} type="number" />
            </FormItem>
            <AdvanceSettings />
            <ETHtoDollar>
              1 {this.state.icon} = ${this.state.priceInDollar}
            </ETHtoDollar>
          </Form>
        </Col>
        <Col xl={6} sm={22}>
          {/* <TransferDescription
            totalUsd={0}
            transactionFee={0.000063}
            amountToSend={this.state.input}
            recipient={'Jacobo'}
            totalAmount={0}
            selectedToken={selectedToken}
            ethInformation={selectedToken}
          /> */}
        </Col>
      </Row>
    );
  }
}
