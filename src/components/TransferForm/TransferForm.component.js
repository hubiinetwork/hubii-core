import React from 'react';
import { Col } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import { gweiToWei, gweiToEther } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';
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

// valid gwei number is numbers, optionally followed by a . at most 9 more numbers
const gweiRegex = new RegExp('^\\d+(\\.\\d{0,9})?$');

// TODO: This component is buggy. Just merging because a lot of eslint issue have been resolved in this branch
export default class TransferForm extends React.PureComponent {
  constructor(props) {
    super(props);

    // max decimals possible for current asset
    const assetToSendMaxDecimals = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === this.props.assets[0].currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToSendInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToSendMaxDecimals}})?$`);

    this.state = {
      amountToSendInput: '0',
      amountToSend: new BigNumber('0'),
      address: this.props.recipients[0] ? this.props.recipients[0].address : '',
      assetToSend: this.props.assets[0],
      assetToSendMaxDecimals,
      amountToSendInputRegex,
      gasPriceGweiInput: '3',
      gasPriceGwei: new BigNumber('3'),
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
    const { assetToSend, address, amountToSend, gasPriceGwei, gasLimit, assetToSendMaxDecimals } = this.state;

    // convert amountToSend into wei or equivilent for an ERC20 token
    const amountToSendWeiOrEquivilent = amountToSend.times(new BigNumber('10').pow(assetToSendMaxDecimals));
    this.props.onSend(assetToSend.symbol, address, amountToSendWeiOrEquivilent, gweiToWei(gasPriceGwei), gasLimit);
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
    const { value } = e.target;
    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ gasPriceGwei: new BigNumber('0'), gasPriceGweiInput: '' });
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
  }

  handleGasLimitChange(e) {
    this.setState({ gasLimit: parseFloat(e.target.value) });
  }

  handleAssetChange(newSymbol) {
    const assetToSend = this.props.assets.find((a) => a.symbol === newSymbol);

    // max decimals possible for current asset
    const assetToSendMaxDecimals = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === assetToSend.currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToSendInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToSendMaxDecimals}})?$`);

    this.setState({
      assetToSend,
      amountToSendInputRegex,
      assetToSendMaxDecimals,
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
    const { amountToSendInputRegex } = this.state;

    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ amountToSendInput: '', amountToSend: new BigNumber('0') });
    }

    // don't update if invalid regex (numbers followed by at most 1 . followed by max possible decimals)
    if (!amountToSendInputRegex.test(value)) return;

    // don't update if is an infeasible amount of Ether (> 100x entire circulating supply as of Aug 2018)
    if (!isNaN(value) && Number(value) > 10000000000) return;

    // update amount to send if it's a real number
    if (!isNaN(value)) {
      this.setState({ amountToSend: new BigNumber(value) });
    }

    // update the input (this could be an invalid number, such as '12.')
    this.setState({ amountToSendInput: value });
  }

  render() {
    const { assetToSend, address, gasLimit, amountToSend, amountToSendInput, gasPriceGwei, gasPriceGweiInput } = this.state;
    const { currentWalletUsdBalance, assets, prices, recipients, transfering } = this.props;

    const assetToSendUsdValue = prices.assets.find((a) => a.currency === assetToSend.currency).usd;
    const usdValueToSend = amountToSend.times(assetToSendUsdValue);
    const ethUsdValue = prices.assets.find((a) => a.currency === 'ETH').usd;


    const ethBalance = this.props.assets.find((currency) => currency.symbol === 'ETH');

    // construct tx fee info
    const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
    const txFeeUsdValue = txFeeAmt.times(ethUsdValue);
    const transactionFee = {
      amount: txFeeAmt,
      usdValue: txFeeUsdValue,
    };

    // construct asset before and after balances
    const assetBalanceBefore = {
      amount: assetToSend.balance,
      usdValue: assetToSend.balance.times(assetToSendUsdValue),
    };
    const assetBalAfterAmt = assetBalanceBefore.amount.minus(amountToSend);
    const assetBalanceAfter = {
      amount: assetBalAfterAmt,
      usdValue: assetBalAfterAmt.times(assetToSendUsdValue),
    };

    // constuct ether before and after balances
    const ethBalanceBefore = {
      amount: ethBalance.balance,
      usdValue: ethBalance.balance.times(ethUsdValue),
    };

    const ethBalanceAfterAmount = assetToSend.symbol === 'ETH'
        ? ethBalanceBefore.amount.minus(amountToSend).minus(transactionFee.amount)
        : ethBalanceBefore.amount.minus(transactionFee.amount);
    const ethBalanceAfter = {
      amount: ethBalanceAfterAmount,
      usdValue: ethBalanceAfterAmount.times(ethUsdValue),
    };

    const walletUsdValueAfter = currentWalletUsdBalance - (usdValueToSend.plus(transactionFee.usdValue)).toNumber();

    return (
      <Row gutter={24} justify="center">
        <Col xl={14} sm={22}>
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
                  <Input disabled={transfering} min={0} defaultValue={gasPriceGweiInput} value={gasPriceGweiInput} onChange={this.handleGasPriceChange} />
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
        <Col xl={9} sm={22}>
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
            lnsCheck={this.props.currentWalletWithInfo.get('type') === 'lns'}
            walletUsdValueAfter={walletUsdValueAfter}
            recipient={address}
            onSend={this.onSend}
            onCancel={this.props.onCancel}
            transfering={this.props.transfering}
            currentWalletWithInfo={this.props.currentWalletWithInfo}
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
  supportedAssets: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
  })),
  onSend: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  transfering: PropTypes.bool,
};
