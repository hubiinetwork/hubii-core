import React from 'react';
import { Icon, Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import { fromJS } from 'immutable';
import { Spring } from 'react-spring';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import {
  gweiToWei,
  gweiToEther,
  isAddressMatch,
} from 'utils/wallet';
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
import EditContactModal from 'components/EditContactModal';
import TransferDescription from 'components/TransferDescription';
import GasOptions from 'components/GasOptions';

import {
  OuterWrapper,
  ETHtoDollar,
  Image,
  StyledButton,
  TransferDescriptionWrapper,
  TransferFormWrapper,
  NahmiiSwitch,
} from './style';

// TODO: This component is buggy. Just merging because a lot of eslint issue have been resolved in this branch
export class TransferForm extends React.PureComponent {
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
    this.showContactModal = this.showContactModal.bind(this);
    this.hideContactModal = this.hideContactModal.bind(this);
    this.onCreateContact = this.onCreateContact.bind(this);
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onGasChange = this.onGasChange.bind(this);
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

  onGasChange(fee, gasLimit, gasPriceGwei) {
    this.setState({ gasLimit: gasLimit.toNumber(), gasPriceGwei });
  }

  handleLayerSwitch() {
    const newLayer = this.state.layer === 'nahmii' ? 'baseLayer' : 'nahmii';
    if (newLayer === 'nahmii') {
      this.setState({ layer: newLayer, showAdv: false });
    } else {
      this.setState({ layer: newLayer });
    }
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
      addContactModalVisibility,
      layer,
    } = this.state;

    const {
      currentWalletWithInfo,
      prices,
      recipients,
      transfering,
      gasStatistics,
      intl,
    } = this.props;
    const { formatMessage } = intl;

    const currentWalletUsdBalance = currentWalletWithInfo.getIn(['balances', 'combined', 'total', 'usd']).toNumber();

    const balKey = layer === 'baseLayer' ? 'baseLayer' : 'nahmiiAvailable';

    const assetToSendUsdValue = prices.assets
      .find((a) => a.currency === assetToSend.currency)
      .usd;
    const usdValueToSend = amountToSend
      .times(assetToSendUsdValue);
    const ethUsdValue = prices.assets
      .find((a) => a.currency === 'ETH').usd;


    // construct tx fee info
    let txFeeAmt;
    let txFeeSymbol;
    if (layer === 'baseLayer') {
      txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
      txFeeSymbol = 'ETH';
    } else {
      const divFactor = new BigNumber('10').pow(assetToSend.decimals);
      const minFee = new BigNumber('1').div(divFactor);
      if (amountToSend.eq('0')) {
        txFeeAmt = new BigNumber('0');
      } else if (amountToSend.times('0.001').gt(minFee)) {
        txFeeAmt = amountToSend.times('0.001');
      } else {
        txFeeAmt = minFee;
      }
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
    const baseLayerEthBalance = currentWalletWithInfo
      .getIn(['balances', 'baseLayer', 'assets'])
      .toJS()
      .find((currency) => currency.symbol === 'ETH');

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

    const disableNahmiiPayments = this.props.currentNetwork.provider._network.name === 'homestead';

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
              <div style={{ marignRight: 'auto' }}>
                <Text large>{formatMessage({ id: 'send_on_the' })} </Text>
                <Tooltip
                  placement="right"
                  overlayStyle={!disableNahmiiPayments && { display: 'none' }}
                  title={<span>{formatMessage({ id: 'nahmii_mainnet' })}</span>}
                >
                  <NahmiiText large />
                  <Text large style={{ marginRight: '0.5rem' }}> {formatMessage({ id: 'second_layer' })}</Text>
                  <NahmiiSwitch disabled={disableNahmiiPayments} checked={layer === 'nahmii'} onChange={(() => this.handleLayerSwitch())} />
                </Tooltip>
              </div>
              <Spring
                from={{ noAdvProg: 0 }}
                to={{ noAdvProg: layer === 'baseLayer' ? 0 : 1 }}
              >
                {
                  (props) => (
                    <div
                      style={{
                        transform: `translate3d(0,${-80 * props.noAdvProg}px,0)`,
                        width: '12rem',
                      }}
                    >
                      <div
                        style={{
                          opacity: ((props.noAdvProg - 1) * -1),
                          visibility: props.noAdvProg === 1 ? 'hidden' : 'visible',
                        }}
                      >
                        <GasOptions
                          defaultGasLimit={gasLimit}
                          defaultGasPrice={gasPriceGwei.toNumber()}
                          gasStatistics={gasStatistics.get('estimate')}
                          defaultOption="average"
                          onChange={this.onGasChange}
                        />
                      </div>
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
            />
          </TransferDescriptionWrapper>
        </OuterWrapper>
      </div>
    );
  }
}
TransferForm.propTypes = {
  prices: PropTypes.object.isRequired,
  gasStatistics: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  currentWalletWithInfo: PropTypes.object.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
  })),
  onSend: PropTypes.func.isRequired,
  transfering: PropTypes.bool,
  hwWalletReady: PropTypes.bool.isRequired,
  createContact: PropTypes.func.isRequired,
  intl: PropTypes.object,
};

export default injectIntl(TransferForm);
