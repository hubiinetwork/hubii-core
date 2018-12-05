import React from 'react';
import { Icon } from 'antd';
import BigNumber from 'bignumber.js';
import { fromJS } from 'immutable';
import { Spring } from 'react-spring';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import { gweiToWei, gweiToEther, isAddressMatch } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';
import { getAbsolutePath } from 'utils/electron';
import { injectIntl } from 'react-intl';

import ComboBoxSelect from 'components/ComboBoxSelect';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import HelperText from 'components/ui/HelperText';
import NahmiiText from 'components/ui/NahmiiText';
import Text from 'components/ui/Text';
import { Modal } from 'components/ui/Modal';
import Collapse, { Panel } from 'components/ui/Collapse';
import EditContactModal from 'components/EditContactModal';

import {
  OuterWrapper,
  ETHtoDollar,
  Image,
  AdvanceSettingsHeader,
  StyledButton,
  TransferDescriptionWrapper,
  TransferFormWrapper,
  NahmiiSwitch,
} from './TransferForm.style';
import TransferDescription from '../TransferDescription';


// valid gwei number is numbers, optionally followed by a . at most 9 more numbers
const gweiRegex = new RegExp('^\\d+(\\.\\d{0,9})?$');

// only match whole numbers
const gasLimitRegex = new RegExp('^\\d+$');

// TODO: This component is buggy. Just merging because a lot of eslint issue have been resolved in this branch
class TransferForm extends React.PureComponent {
  constructor(props) {
    super(props);
    // const assetToSend = this.props.currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets', 0]).toJS();
    const assetToSend = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('symbol') === 'ETH')
      .toJS();

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToSendInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToSend.decimals}})?$`);

    this.state = {
      amountToSendInput: '0',
      amountToSend: new BigNumber('0'),
      address: this.props.recipients[0] ? this.props.recipients[0].address : '',
      assetToSend,
      amountToSendInputRegex,
      gasPriceGweiInput: '10',
      gasPriceGwei: new BigNumber('10'),
      gasLimit: 21000,
      addContactModalVisibility: false,
      gasLimitInput: '21000',
      layer: 'baseLayer',
      showAdv: false,
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
    this.handleLayerSwitch = this.handleLayerSwitch.bind(this);
  }

  onSend() {
    const {
      assetToSend,
      address,
      amountToSend,
      gasPriceGwei,
      gasLimit,
      layer,
    } = this.state;

    // convert amountToSend into wei or equivilent for an ERC20 token
    const amountToSendWeiOrEquivilent = amountToSend.times(new BigNumber('10').pow(assetToSend.decimals));
    this.props.onSend(assetToSend.symbol, address, amountToSendWeiOrEquivilent, layer, gweiToWei(gasPriceGwei), gasLimit);
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

  handleLayerSwitch() {
    const newLayer = this.state.layer === 'nahmii' ? 'baseLayer' : 'nahmii';
    if (newLayer === 'nahmii') {
      this.setState({ layer: newLayer, showAdv: false });
    } else {
      this.setState({ layer: newLayer });
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
    const assetToSend = this.props.supportedAssets
      .get('assets')
      .find((a) => a.get('symbol') === newSymbol)
      .toJS();

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToSendInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToSend.decimals}})?$`);

    // set a higher gas limit for erc20 tokens
    let gasLimit = 21000;
    if (newSymbol !== 'ETH') gasLimit = 100000;

    this.setState({
      assetToSend,
      amountToSendInputRegex,
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
    const { formatMessage } = this.props.intl;
    let address = value;
    const recipientMatch = this.props.recipients.find((contact) => contact.name.toLowerCase() === value.toLowerCase() || isAddressMatch(contact.address, value));
    if (recipientMatch && !isValidAddress(value)) {
      address = recipientMatch.address;
    } else if (!recipientMatch && !isValidAddress(value)) {
      address = formatMessage({ id: 'enter_valid_address_contact' });
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
      layer,
    } = this.state;

    const {
      currentWalletWithInfo,
      currentWalletUsdBalance,
      prices,
      recipients,
      transfering,
      intl,
    } = this.props;
    const { formatMessage } = intl;

    const balKey = layer === 'baseLayer' ? 'baseLayer' : 'nahmiiAvailable';

    const assetToSendUsdValue = prices.assets
      .find((a) => a.currency === assetToSend.currency)
      .usd;
    const usdValueToSend = amountToSend
      .times(assetToSendUsdValue);
    const ethUsdValue = prices.assets
      .find((a) => a.currency === 'ETH').usd;


    const baseLayerEthBalance = currentWalletWithInfo
      .getIn(['balances', balKey, 'assets'])
      .toJS()
      .find((currency) => currency.symbol === 'ETH');

    // construct tx fee info
    let txFeeAmt;
    let txFeeSymbol;
    if (layer === 'baseLayer') {
      txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
      txFeeSymbol = 'ETH';
    } else {
      txFeeAmt = new BigNumber('0.00000001');
      txFeeSymbol = assetToSend.symbol;
    }
    const txFeeUsdValue = txFeeAmt.times(
      prices.assets
      .find((a) => a.currency === assetToSend.currency)
      .usd
      );
    const transactionFee = {
      amount: txFeeAmt,
      usdValue: txFeeUsdValue,
      symbol: txFeeSymbol,
    };

    // construct asset before and after balances
    const assetBalBeforeAmt = (currentWalletWithInfo
      .getIn(['balances', balKey, 'assets'])
      .find((a) => a.get('currency') === assetToSend.currency) || fromJS({ balance: new BigNumber('0') }))
      .get('balance');

    const assetBalanceBefore = {
      amount: assetBalBeforeAmt,
      usdValue: assetBalBeforeAmt.times(assetToSendUsdValue),
    };
    const assetBalAfterAmt = layer === 'nahmii'
      ? assetBalanceBefore.amount.minus(amountToSend).minus(transactionFee.amount)
      : assetBalanceBefore.amount.minus(amountToSend);
    const assetBalanceAfter = {
      amount: assetBalAfterAmt,
      usdValue: assetBalAfterAmt.times(assetToSendUsdValue),
    };

    // constuct ether before and after balances
    const baseLayerEthBalanceBefore = {
      amount: baseLayerEthBalance.balance,
      usdValue: baseLayerEthBalance.balance.times(ethUsdValue),
    };

    const baseLayerEthBalanceAfterAmount = assetToSend.symbol === 'ETH'
        ? baseLayerEthBalanceBefore.amount.minus(amountToSend).minus(transactionFee.amount)
        : baseLayerEthBalanceBefore.amount.minus(transactionFee.amount);
    const baseLayerEthBalanceAfter = {
      amount: baseLayerEthBalanceAfterAmount,
      usdValue: baseLayerEthBalanceAfterAmount.times(ethUsdValue),
    };

    const walletUsdValueAfter = currentWalletUsdBalance - (usdValueToSend.plus(transactionFee.usdValue)).toNumber();

    return (
      <div>
        <Modal
          footer={null}
          width={'41.8rem'}
          maskClosable
          style={{ marginTop: '1.43rem' }}
          visible={addContactModalVisibility}
          onCancel={this.hideContactModal}
          destroyOnClose
        >
          <EditContactModal
            onEdit={(contact) => this.onCreateContact(contact)}
            contacts={recipients}
            quickAddAddress={address}
            confirmText={formatMessage({ id: 'create_contact' })}
          />
        </Modal>

        <OuterWrapper>
          <TransferFormWrapper>
            <Form>
              <FormItem
                label={<FormItemLabel>{formatMessage({ id: 'select_asset' })}</FormItemLabel>}
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
                  {currentWalletWithInfo.getIn(['balances', balKey, 'assets']).toJS().map((currency) => (
                    <Option value={currency.symbol} key={currency.symbol}>
                      {currency.symbol}
                    </Option>
                ))}
                </Select>
              </FormItem>
              <FormItem
                label={<FormItemLabel>{formatMessage({ id: 'select_recipient' })}</FormItemLabel>}
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
                      {formatMessage({ id: 'add_address_contacts_book' })}
                    </StyledButton>
                }
              >
                <ComboBoxSelect
                  disabled={transfering}
                  options={recipients.map((recipient) => ({ name: recipient.name, value: recipient.address }))}
                  handleSelect={(value) => this.handleRecipient(value)}
                  addInputValidator={(value) => isValidAddress(value)}
                  invalidAdditionMessage={formatMessage({ id: 'enter_valid_address_contact' })}
                />
              </FormItem>
              <FormItem
                label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
                colon={false}
                help={<HelperText left={formatFiat(usdValueToSend, 'USD')} right={formatMessage({ id: 'usd' })} />}
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
              <div>
                <Text large>Send instantly on the </Text>
                <NahmiiText large />
                <Text large style={{ marginRight: '0.5rem' }}> second layer</Text>
                <NahmiiSwitch checked={layer === 'nahmii'} onChange={(() => this.handleLayerSwitch())} />
              </div>
              <Spring
                from={{ noAdvProg: 0 }}
                to={{ noAdvProg: layer === 'baseLayer' ? 0 : 1 }}
              >
                {
                  (props) => (
                    <div
                      style={{
                        transform: `translate3d(0,${-20 * props.noAdvProg}px,0)`,
                        width: '12rem',
                      }}
                    >
                      <Collapse
                        style={{
                          opacity: ((props.noAdvProg - 1) * -1),
                          visibility: props.noAdvProg === 1 ? 'hidden' : 'visible',
                        }}
                        bordered={false}
                        activeKey={this.state.showAdv ? '1' : '0'}
                      >
                        <Panel
                          header={
                            <AdvanceSettingsHeader
                              onClick={() => this.setState({ showAdv: !this.state.showAdv })}
                            >
                              {formatMessage({ id: 'advanced_settings' })}
                            </AdvanceSettingsHeader>}
                          key="1"
                        >
                          <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_price' })}</FormItemLabel>} colon={false}>
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
                          <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_limit' })}</FormItemLabel>} colon={false}>
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
                    </div>
                  )
                }
              </Spring>
            </Form>
          </TransferFormWrapper>
          <TransferDescriptionWrapper>
            <TransferDescription
              layer={layer}
              transactionFee={transactionFee}
              amountToSend={amountToSend}
              assetToSend={assetToSend}
              usdValueToSend={usdValueToSend}
              baseLayerEthBalanceBefore={baseLayerEthBalanceBefore}
              baseLayerEthBalanceAfter={baseLayerEthBalanceAfter}
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
  intl: PropTypes.object,
};

export default injectIntl(TransferForm);
