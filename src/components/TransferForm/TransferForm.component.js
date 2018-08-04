import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import { gweiToWei } from 'utils/wallet';
import { formatFiat, formatEthAmount } from 'utils/numberFormats';
import { isValidAddress } from 'ethereumjs-util';
import { getAbsolutePath } from 'utils/electron';
import {
  Row,
  ETHtoDollar,
  Image,
  AdvanceSettingsHeader,
  Collapse,
  Panel,
  StyledSelect,
} from './TransferForm.style';
import InputNumber from '../ui/InputNumber';
import Select, { Option } from '../ui/Select';
import { Form, FormItem, FormItemLabel } from '../ui/Form';
import HelperText from '../ui/HelperText';
import TransferDescription from '../TransferDescription';
import Input from '../ui/Input';


// TODO: This component is buggy. Just merging because a lot of eslint issue have been resolved in this branch
export default class TransferForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      amountToSendInput: '0',
      amountToSend: 0,
      address: this.props.recipients[0] ? this.props.recipients[0].address : '',
      assetToSend: this.props.assets[0],
      gasPriceGwei: 3,
      gasLimit: 21000,
      selectValue: null,
      addressInputVisibility: false,
      options: [],
    };
    this.handleAmountToSendChange = this.handleAmountToSendChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.onSend = this.onSend.bind(this);
    this.handleRecipient = this.handleRecipient.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentWillMount() {
    this.setState({
      options: this.props.recipients,
    });
  }

  onBlur() {
    if (isValidAddress(this.state.selectValue)) {
      this.setState({ address: this.state.selectValue });
    }
  }

  onSend() {
    const { assetToSend, address, amountToSend, gasPriceGwei, gasLimit } = this.state;
    this.props.onSend(assetToSend.symbol, address, amountToSend, gweiToWei(gasPriceGwei), gasLimit);
  }

  onInputKeyDown(event) {
    const value = event.target.value;
    if (event.key === 'Enter' && !isValidAddress(value)) {
      this.setState({ selectValue: 'Invalid Address or Not Found Contact' });
      return;
    }
    if (event.key === 'Enter' && this.state.options.every((item) => item.name !== value)) {
      this.setState((prevState) => ({
        options: [...prevState.options, { name: value, address: value }],
      }));
    }
  }

  handleGasPriceChange(e) {
    this.setState({ gasPriceGwei: parseFloat(e.target.value) });
  }

  handleGasLimitChange(e) {
    this.setState({ gasLimit: parseFloat(e.target.value) });
  }

  handleAssetChange(newSymbol) {
    this.setState({
      assetToSend: this.props.assets.find((a) => a.symbol === newSymbol),
    });
  }

  handleRecipient(value) {
    let address = value;
    if (!isValidAddress(value)) {
      address = this.state.options.find((option) => option.name === value).address;
    }
    this.setState({
      address,
      selectValue: value,
    });
  }


  handleAmountToSendChange(e) {
    const { value } = e.target;
    if (value === '' || value.endsWith('.') || value.endsWith('0')) {
      if (!value.match('[^0.]')) {
        this.setState({ amountToSend: 0 });
      }
      this.setState({ amountToSendInput: value });
      return;
    }

    if (isNaN(value)) {
      return;
    }

    if (Number(value).toString().includes('e-')) {
      const len = value.length + 2 < 20 ? value.length - 2 : 20;
      this.setState({ amountToSendInput: formatEthAmount(Number(value)).toFixed(len) });
    } else {
      this.setState({ amountToSendInput: formatEthAmount(Number(value)).toString() });
    }

    this.setState({ amountToSend: formatEthAmount(Number(value)) });
  }
  render() {
    const { assetToSend, address, gasLimit, amountToSend, amountToSendInput, gasPriceGwei } = this.state;
    const { currentWalletUsdBalance, assets, prices, recipients, transfering } = this.props;

    const assetToSendUsdValue = prices.assets.find((a) => a.currency === assetToSend.currency).usd;
    const usdValueToSend = amountToSend * assetToSendUsdValue;
    const ethUsdValue = prices.assets.find((a) => a.currency === 'ETH').usd;


    const ethBalance = this.props.assets.find((currency) => currency.symbol === 'ETH');

    const transactionFee = { amount: (gasPriceGwei * gasLimit) / (10 ** 9), usdValue: ((gasPriceGwei * gasLimit) / (10 ** 9)) * ethUsdValue };
    const assetBalanceBefore = { amount: assetToSend.balance, usdValue: assetToSend.balance * assetToSendUsdValue };
    const assetBalanceAfter = { amount: assetBalanceBefore.amount - amountToSend, usdValue: (assetBalanceBefore.amount - amountToSend) * assetToSendUsdValue };
    const ethBalanceBefore = { amount: ethBalance.balance, usdValue: ethBalance.balance * ethUsdValue };

    const ethBalanceAfterAmount = assetToSend.symbol === 'ETH'
        ? ethBalanceBefore.amount - amountToSend - transactionFee.amount
        : ethBalanceBefore.amount - transactionFee.amount;
    const ethBalanceAfter = {
      amount: ethBalanceAfterAmount,
      usdValue: ethBalanceAfterAmount * ethUsdValue,
    };

    const walletUsdValueAfter = currentWalletUsdBalance - (usdValueToSend + transactionFee.usdValue);

    return (
      <Row gutter={24} justify="center">
        <Col xl={16} sm={22}>
          <Form>
            <FormItem
              label={<FormItemLabel>Asset</FormItemLabel>}
              colon={false}
            >
              <Image>
                <img
                  src={getAbsolutePath(`public/images/assets/${assetToSend.symbol}.svg`)}
                  width="32px"
                  height="32px"
                  alt="logo"
                />
              </Image>
              <Select disabled={transfering} defaultValue={assetToSend.symbol} onSelect={this.handleAssetChange}>
                {assets.map((currency) => (
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
              <StyledSelect
                disabled={transfering}
                showSearch
                defaultValue={recipients[0] ? recipients[0].name : ''}
                recipient
                onInputKeyDown={this.onInputKeyDown}
                onSearch={(value) => this.setState({ selectValue: value })}
                onSelect={this.handleRecipient}
                notFoundContent={this.state.selectValue}
                onBlur={this.onBlur}
              >
                {this.state.options.map((recipient) => (
                  <Option key={recipient.name} value={recipient.name}>
                    {recipient.name}
                  </Option>
                ))}
              </StyledSelect>
            </FormItem>
            <FormItem
              label={<FormItemLabel>Amount</FormItemLabel>}
              colon={false}
              help={<HelperText left={formatFiat(usdValueToSend, 'USD')} right="USD" />}
            >
              <Input disabled={transfering} defaultValue={amountToSendInput} value={amountToSendInput} onChange={this.handleAmountToSendChange} />
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
                  <InputNumber disabled={transfering} min={0} defaultValue={gasPriceGwei} value={gasPriceGwei} handleChange={this.handleGasPriceChange} />
                </FormItem>
                <FormItem label={<FormItemLabel>Gas Limit</FormItemLabel>} colon={false}>
                  <InputNumber disabled={transfering} min={0} defaultValue={gasLimit} handleChange={this.handleGasLimitChange} />
                </FormItem>
              </Panel>
            </Collapse>
            <ETHtoDollar>
              {`1 ${assetToSend.symbol} = ${formatFiat(assetToSendUsdValue, 'USD')}`}
            </ETHtoDollar>
          </Form>
        </Col>
        <Col xl={6} sm={22}>
          <TransferDescription
            transactionFee={transactionFee}
            amountToSend={amountToSend}
            assetToSend={assetToSend}
            usdValueToSend={usdValueToSend}
            ethBalanceBefore={ethBalanceBefore}
            ethBalanceAfter={ethBalanceAfter}
            assetBalanceBefore={assetBalanceBefore}
            assetBalanceAfter={assetBalanceAfter}
            walletUsdValueBefore={currentWalletUsdBalance}
            lnsCheck={this.props.currentWalletDetails.get('type') === 'lns'}
            walletUsdValueAfter={walletUsdValueAfter}
            recipient={address}
            onSend={this.onSend}
            onCancel={this.props.onCancel}
            transfering={this.props.transfering}
            currentWalletDetails={this.props.currentWalletDetails}
            errors={this.props.errors}
          />
        </Col>
      </Row>
    );
  }
}
TransferForm.propTypes = {
  assets: PropTypes.array.isRequired,
  currentWalletUsdBalance: PropTypes.number.isRequired,
  prices: PropTypes.object.isRequired,
  currentWalletDetails: PropTypes.object.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
  })),
  onSend: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  transfering: PropTypes.bool,
};
