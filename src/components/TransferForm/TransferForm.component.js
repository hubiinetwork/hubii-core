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
      input: 0
    };
  }
  handleChange = e => {
    this.setState({ input: e.target.value });
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
              <Image src="../../../public/asset_images/ETH.svg" />
              <Select defaultValue="ETH">
                <Option value="helllo">ETH</Option>
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Recipient</FormItemLabel>}
              colon={false}
              help={
                <HelperText left="0xf400db37c54c535febca1b470fd1d23d30acdd11" />
              }
            >
              <Select defaultValue="Jacobo">
                <OptGroup label={<OptGroupLabel>Own Addresses</OptGroupLabel>}>
                  <Option value="jacobo">Jacobo</Option>
                </OptGroup>
              </Select>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Amount</FormItemLabel>}
              colon={false}
              help={<HelperText left="0.00" right="USD" />}
            >
              <Input onChange={this.handleChange} />
            </FormItem>
            <AdvanceSettings />
            <ETHtoDollar>1 ETH = $663.07 </ETHtoDollar>
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
