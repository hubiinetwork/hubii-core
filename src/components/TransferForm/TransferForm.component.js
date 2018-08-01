import React from 'react';
import { Col } from 'antd';
import BigNumber from 'bignumber.js';
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
import Input from '../ui/Input';

// valid gwei number is numbers, optionally followed by a . at most 9 more numbers
const gweiRegex = new RegExp('^\\d+(\\.\\d{0,9})?$');

// TODO: This component is buggy. Just merging because a lot of eslint issue have been resolved in this branch
export default class TransferForm extends React.PureComponent {
  constructor(props) {
    super(props);

    // max decimals possible for current asset
    const amountInputMaxDecimals = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === this.props.assets[0].currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountInputRegex = new RegExp(`^\\d+(\\.\\d{0,${amountInputMaxDecimals}})?$`);

    this.state = {
      amountToSendInput: '0',
      amountToSend: 0,
      address: this.props.recipients[0] ? this.props.recipients[0].address : '',
      assetToSend: this.props.assets[0],
      amountInputRegex,
      gasPriceGweiInput: '3',
      gasPriceGwei: 3,
      gasLimit: 21000,
    };
    this.handleAmountToSendChange = this.handleAmountToSendChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.onSend = this.onSend.bind(this);
    this.handleRecipient = this.handleRecipient.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
  }

  onSend() {
    const { assetToSend, address, amountToSend, gasPriceGwei, gasLimit } = this.state;
    this.props.onSend(assetToSend.symbol, address, amountToSend, gweiToWei(new BigNumber(gasPriceGwei)).toNumber(), gasLimit);
  }

  handleAmountToSendChange(e) {
    const { value } = e.target;
    const { amountInputRegex } = this.state;

    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ amountToSendInput: '', amountToSend: 0 });
    }

    // don't update if invalid regex (numbers followed by at most 1 . followed by max possible decimals)
    if (!amountInputRegex.test(value)) return;

    // don't update if is an infeasible amount of Ether (> 100x entire circulating supply as of Aug 2018)
    if (!isNaN(value) && Number(value) > 10000000000) return;

    // update amount to send if it's a real number
    if (!isNaN(value)) {
      this.setState({ amountToSend: Number(value) });
    }

    // update the input (this could be an invalid number, such as '12.')
    this.setState({ amountToSendInput: value });
  }

  handleGasPriceChange(e) {
    const { value } = e.target;
    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ gasPriceGwei: 0, gasPriceGweiInput: '' });
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
      this.setState({ gasPriceGwei: value });
    }
  }

  handleGasLimitChange(e) {
    this.setState({ gasLimit: parseFloat(e.target.value) });
  }

  handleAssetChange(newSymbol) {
    const assetToSend = this.props.assets.find((a) => a.symbol === newSymbol);

    // max decimals possible for current asset
    const amountInputMaxDecimals = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === assetToSend.currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountInputRegex = new RegExp(`^\\d+(\\.\\d{0,${amountInputMaxDecimals}})?$`);

    this.setState({
      assetToSend,
      amountInputRegex,
    });
  }

  handleRecipient(value) {
    this.setState({
      address: value,
    });
  }

  render() {
    const { assetToSend, address, gasLimit, amountToSend, amountToSendInput, gasPriceGwei, gasPriceGweiInput } = this.state;
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
              <Select
                disabled={transfering}
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
