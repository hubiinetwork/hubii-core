import React from 'react';
import { Icon } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import { gweiToWei, gweiToEther, isAddressMatch } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';
import { getAbsolutePath } from 'utils/electron';

import ComboBoxSelect from 'components/ComboBoxSelect';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import HelperText from 'components/ui/HelperText';
import { Modal } from 'components/ui/Modal';
import EditContactModal from 'components/EditContactModal';

import {
  OuterWrapper,
  ETHtoDollar,
  Image,
  AdvanceSettingsHeader,
  Collapse,
  Panel,
  StyledButton,
  TransferDescriptionWrapper,
  TransferFormWrapper,
} from './TransferForm.style';
import TransferDescription from '../TransferDescription';


// valid gwei number is numbers, optionally followed by a . at most 9 more numbers
const gweiRegex = new RegExp('^\\d+(\\.\\d{0,9})?$');

// only match whole numbers
const gasLimitRegex = new RegExp('^\\d+$');

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
      addContactModalVisibility: false,
      gasLimitInput: '21000',
    };
    this.handleAmountToSendChange = this.handleAmountToSendChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.onSend = this.onSend.bind(this);
    this.handleRecipient = this.handleRecipient.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
    this.showContactModal = this.showContactModal.bind(this);
    this.hideContactModal = this.hideContactModal.bind(this);
    this.onCreateContact = this.onCreateContact.bind(this);
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
  }

  onSend() {
    const { assetToSend, address, amountToSend, gasPriceGwei, gasLimit, assetToSendMaxDecimals } = this.state;

    // convert amountToSend into wei or equivilent for an ERC20 token
    const amountToSendWeiOrEquivilent = amountToSend.times(new BigNumber('10').pow(assetToSendMaxDecimals));
    this.props.onSend(assetToSend.symbol, address, amountToSendWeiOrEquivilent, gweiToWei(gasPriceGwei), gasLimit);
  }

  onCreateContact(contact) {
    if (contact) {
      this.props.createContact(contact.name, contact.address);
    }
    this.hideContactModal();
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
    const { value } = e.target;
    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ gasLimitInput: '', gasLimit: 0 });
    }

    // only allow whole numbers
    if (!gasLimitRegex.test(value)) return;

    // don't allow infeasible amount of gas
    // (gas limit per block almost never exeeds 10 million as of Aug 2018  )
    const ONE_HUNDRED_MILLION = 100000000;
    if (value > ONE_HUNDRED_MILLION) return;

    this.setState({ gasLimitInput: value, gasLimit: parseInt(value, 10) });
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

    // set a higher gas limit for erc20 tokens
    let gasLimit = 21000;
    if (newSymbol !== 'ETH') gasLimit = 100000;

    this.setState({
      assetToSend,
      amountToSendInputRegex,
      assetToSendMaxDecimals,
      gasLimit,
      gasLimitInput: gasLimit.toString(),
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

  showContactModal() {
    this.setState({ addContactModalVisibility: true });
  }

  hideContactModal() {
    this.setState({
      addContactModalVisibility: false,
    });
  }

  handleRecipient(value) {
    let address = value;
    const recipientMatch = this.props.recipients.find((contact) => contact.name.toLowerCase() === value.toLowerCase() || isAddressMatch(contact.address, value));
    if (recipientMatch && !isValidAddress(value)) {
      address = recipientMatch.address;
    } else if (!recipientMatch && !isValidAddress(value)) {
      address = 'Please enter a valid address or contact name';
    }
    this.setState({
      address,
    });
  }

  render() {
    const {
      assetToSend,
      address,
      gasLimit,
      amountToSend,
      amountToSendInput,
      gasPriceGwei,
      gasPriceGweiInput,
      gasLimitInput,
      addContactModalVisibility,
    } = this.state;

    const { currentWalletUsdBalance, assets, prices, recipients, transfering } = this.props;

    const assetToSendUsdValue = prices.assets
      .find((a) => a.currency === assetToSend.currency).usd;
    const usdValueToSend = amountToSend
      .times(assetToSendUsdValue);
    const ethUsdValue = prices.assets
      .find((a) => a.currency === 'ETH').usd;


    const ethBalance = this.props.assets
      .find((currency) => currency.symbol === 'ETH');

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
      <div>
        <Modal
          footer={null}
          width={'41.8rem'}
          maskClosable
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '1.43rem' }}
          visible={addContactModalVisibility}
          onCancel={this.hideContactModal}
          destroyOnClose
        >
          <EditContactModal
            onEdit={(contact) => this.onCreateContact(contact)}
            contacts={recipients}
            quickAddAddress={address}
            confirmText="Create contact"
          />
        </Modal>

        <OuterWrapper>
          <TransferFormWrapper>
            <Form>
              <FormItem
                label={<FormItemLabel>Select an asset to send</FormItemLabel>}
                colon={false}
              >
                <Image
                  src={getAbsolutePath(`public/images/assets/${assetToSend.symbol}.svg`)}
                  alt="logo"
                />
                <Select
                  disabled={transfering}
                  defaultValue={assetToSend.symbol}
                  onSelect={this.handleAssetChange}
                  style={{ paddingLeft: '0.5rem' }}
                >
                  {assets.map((currency) => (
                    <Option value={currency.symbol} key={currency.symbol}>
                      {currency.symbol}
                    </Option>
                ))}
                </Select>
              </FormItem>
              <FormItem
                label={<FormItemLabel>Specify the recipient</FormItemLabel>}
                colon={false}
                help={
                  this.props.recipients.find((recipient) => isAddressMatch(recipient.address, address)) ?
                    <HelperText left={address} /> :
                    !isValidAddress(address) ?
                    null :
                    <StyledButton
                      type="primary"
                      onClick={this.showContactModal}
                    >
                      <Icon type="plus" />
                      Add address to your contacts book
                  </StyledButton>
                }
              >
                <ComboBoxSelect
                  disabled={transfering}
                  options={recipients.map((recipient) => ({ name: recipient.name, value: recipient.address }))}
                  handleSelect={(value) => this.handleRecipient(value)}
                  addInputValidator={(value) => isValidAddress(value)}
                  invalidAdditionMessage={'Please enter a valid address or contact name'}
                />
              </FormItem>
              <FormItem
                label={<FormItemLabel>Enter an amount</FormItemLabel>}
                colon={false}
                help={<HelperText left={formatFiat(usdValueToSend, 'USD')} right="USD" />}
              >
                <Input
                  disabled={transfering}
                  defaultValue={amountToSendInput}
                  value={amountToSendInput}
                  onFocus={() => this.onFocusNumberInput('amountToSendInput')}
                  onBlur={() => this.onBlurNumberInput('amountToSendInput')}
                  onChange={this.handleAmountToSendChange}
                />
              </FormItem>
              <Collapse bordered={false} defaultActiveKey={['2']}>
                <Panel
                  header={<AdvanceSettingsHeader>Advanced settings</AdvanceSettingsHeader>}
                  key="1"
                >
                  <FormItem label={<FormItemLabel>Gas price</FormItemLabel>} colon={false}>
                    <Input
                      disabled={transfering}
                      min={0}
                      defaultValue={gasPriceGweiInput}
                      value={gasPriceGweiInput}
                      onChange={this.handleGasPriceChange}
                      onFocus={() => this.onFocusNumberInput('gasPriceGweiInput')}
                      onBlur={() => this.onBlurNumberInput('gasPriceGweiInput')}
                    />
                  </FormItem>
                  <FormItem label={<FormItemLabel>Gas limit</FormItemLabel>} colon={false}>
                    <Input
                      disabled={transfering}
                      value={gasLimitInput}
                      defaultValue={gasLimitInput}
                      onChange={this.handleGasLimitChange}
                      onFocus={() => this.onFocusNumberInput('gasLimitInput')}
                      onBlur={() => this.onBlurNumberInput('gasLimitInput')}
                    />
                  </FormItem>
                </Panel>
              </Collapse>
              <ETHtoDollar>
                {`1 ${assetToSend.symbol} = ${formatFiat(assetToSendUsdValue, 'USD')}`}
              </ETHtoDollar>
            </Form>
          </TransferFormWrapper>
          <TransferDescriptionWrapper>
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
              walletUsdValueAfter={walletUsdValueAfter}
              recipient={address}
              onSend={this.onSend}
              hwWalletReady={this.props.hwWalletReady}
              transfering={this.props.transfering}
              currentWalletWithInfo={this.props.currentWalletWithInfo}
              errors={this.props.errors}
            />
          </TransferDescriptionWrapper>
        </OuterWrapper>
      </div>
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
  errors: PropTypes.object.isRequired,
  transfering: PropTypes.bool,
  hwWalletReady: PropTypes.bool.isRequired,
  createContact: PropTypes.func.isRequired,
};
