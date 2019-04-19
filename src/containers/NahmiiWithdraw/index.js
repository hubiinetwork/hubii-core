/**
 *
 * NahmiiWithdraw
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { shell } from 'electron';
import moment from 'moment';
import { Alert, Row, Steps, Icon, Tooltip } from 'antd';
import { getAbsolutePath, assetImageFallback } from 'utils/electron';
import {
  gweiToEther,
  gweiToWei,
  isHardwareWallet,
  walletReady,
} from 'utils/wallet';
import BigNumber from 'bignumber.js';
import { formatFiat } from 'utils/numberFormats';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import HelperText from 'components/ui/HelperText';
import Text from 'components/ui/Text';
import NumericText from 'components/ui/NumericText';
import SelectableText from 'components/ui/SelectableText';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import TransferDescriptionItem from 'components/TransferDescriptionItem';
import GasOptions from 'components/GasOptions';
import HWPromptContainer from 'containers/HWPromptContainer';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import { makeSelectGasStatistics } from 'containers/EthOperationsHoc/selectors';
import {
  makeSelectOngoingChallengesForCurrentWalletCurrency,
  makeSelectSettleableChallengesForCurrentWalletCurrency,
  makeSelectWithdrawalsForCurrentWalletCurrency,
} from 'containers/NahmiiHoc/selectors';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/NahmiiHoc/combined-selectors';
import {
  setSelectedWalletCurrency,
  startChallenge,
  settle,
  withdraw,
} from 'containers/NahmiiHoc/actions';
import { injectIntl } from 'react-intl';

import {
  ContentWrapper,
  BottomWrapper,
  Image,
  DollarPrice,
  StyledCol,
  StyledSpin,
  StyledButton,
  HWPromptWrapper,
  LoadingWrapper,
  NoTxPlaceholder,
  SettlementWarning,
  ScrollableContentWrapper,
  StyledSteps,
} from './style';

// import ScrollableContentWrapper from '../../components/ui/ScrollableContentWrapper';
const Step = Steps.Step;

export class NahmiiWithdraw extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const nahmiiCombinedAssets = props.currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'assets']).toJS();
    const assetToWithdraw = nahmiiCombinedAssets[0] || { symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000', balance: new BigNumber('0') };

    // max decimals possible for current asset
    let assetToWithdrawMaxDecimals = 18;
    if (props.supportedAssets.get('assets').size !== 0) {
      assetToWithdrawMaxDecimals = props.supportedAssets && props.supportedAssets
        .get('assets')
        .find((a) => a.get('currency') === assetToWithdraw.currency)
        .get('decimals');
    }

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToWithdrawInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToWithdrawMaxDecimals}})?$`);

    this.state = {
      amountToWithdrawInput: '0',
      amountToWithdraw: new BigNumber('0'),
      assetToWithdraw,
      assetToWithdrawMaxDecimals,
      amountToWithdrawInputRegex,
      gasPriceGweiInput: '10',
      gasPriceGwei: new BigNumber('10'),
      gasLimit: 6000000,
      gasLimitInput: '6000000',
      addContactModalVisibility: false,
    };
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
    this.onGasChange = this.onGasChange.bind(this);
    this.handleAmountToWithdrawChange = this.handleAmountToWithdrawChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.generateTxStatus = this.generateTxStatus.bind(this);
    this.getRequiredSettlementAmount = this.getRequiredSettlementAmount.bind(this);
    this.startChallenge = this.startChallenge.bind(this);
    this.settle = this.settle.bind(this);
    this.withdraw = this.withdraw.bind(this);

    props.setSelectedWalletCurrency(assetToWithdraw.currency);
  }

  componentDidUpdate(prevProps) {
    const { assetToWithdraw } = this.state;
    const { currentWalletWithInfo } = this.props;

    const nahmiiCombinedAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'assets']).toJS();
    const asset = nahmiiCombinedAssets.find((a) => a.symbol === assetToWithdraw.symbol);
    if (asset && asset.balance.toString() !== assetToWithdraw.balance.toString()) {
      assetToWithdraw.balance = asset.balance;
    }

    for (let type of ['ongoingChallenges', 'settleableChallenges', 'withdrawals']) { // eslint-disable-line
      const currentChallengeTxStatus = this.props[type].get('status');
      const prevChallengeTxStatus = prevProps[type].get('status');
      if (currentChallengeTxStatus === 'success' && prevChallengeTxStatus !== 'success') {
        this.setState({ amountToWithdrawInput: '0', amountToWithdraw: new BigNumber('0') }); // eslint-disable-line
      }
    }
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

  getRequiredSettlementAmount(stagedAmount, amountToWithdraw) {
    if (amountToWithdraw.gt(stagedAmount)) {
      return amountToWithdraw.minus(stagedAmount);
    }
    return new BigNumber(0);
  }

  getCurrencyAddress(currency) {
    return currency === 'ETH' ? '0x0000000000000000000000000000000000000000' : currency;
  }

  getMaxExpirationTime() {
    const { ongoingChallenges } = this.props;
    const maxExpirationTime = ongoingChallenges.get('details').reduce((max, challenge) => {
      const { expirationTime } = challenge;
      return max > expirationTime ? max : expirationTime;
    }, 0);

    return maxExpirationTime;
  }

  settle(assetToWithdraw) {
    const { currentWalletWithInfo } = this.props;
    const { gasLimit, gasPriceGwei } = this.state;
    const currency = this.getCurrencyAddress(assetToWithdraw.currency);
    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };
    this.props.settle(currentWalletWithInfo.get('address'), currency, options);
  }

  startChallenge(stageAmount, assetToWithdraw) {
    const { currentWalletWithInfo } = this.props;
    const { assetToWithdrawMaxDecimals, gasLimit, gasPriceGwei } = this.state;
    const currency = this.getCurrencyAddress(assetToWithdraw.currency);
    const stageAmountBN = stageAmount.times(new BigNumber(10).pow(assetToWithdrawMaxDecimals));
    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };
    this.props.startChallenge(currentWalletWithInfo.get('address'), currency, stageAmountBN, options);
  }

  withdraw(amountToWithdraw, assetToWithdraw) {
    const { currentWalletWithInfo } = this.props;
    const { assetToWithdrawMaxDecimals, gasLimit, gasPriceGwei } = this.state;
    const currency = this.getCurrencyAddress(assetToWithdraw.currency);
    const amountToWithdrawBN = amountToWithdraw.times(new BigNumber(10).pow(assetToWithdrawMaxDecimals));
    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };
    this.props.withdraw(amountToWithdrawBN, currentWalletWithInfo.get('address'), currency, options);
  }

  handleAssetChange(newSymbol) {
    const { currentWalletWithInfo, supportedAssets } = this.props;
    const nahmiiCombinedAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'assets']).toJS();
    const assetToWithdraw = nahmiiCombinedAssets.find((a) => a.symbol === newSymbol);

    // max decimals possible for current asset
    const assetToWithdrawMaxDecimals = supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === assetToWithdraw.currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToWithdrawInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToWithdrawMaxDecimals}})?$`);

    const currency = this.getCurrencyAddress(assetToWithdraw.currency);
    this.props.setSelectedWalletCurrency(currency);

    this.setState({
      assetToWithdraw,
      amountToWithdrawInputRegex,
      assetToWithdrawMaxDecimals,
    });
  }

  handleAmountToWithdrawChange(e) {
    const { value } = e.target;
    const { amountToWithdrawInputRegex } = this.state;

    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ amountToWithdrawInput: '', amountToWithdraw: new BigNumber('0') });
    }

    // don't update if invalid regex (numbers followed by at most 1 . followed by max possible decimals)
    if (!amountToWithdrawInputRegex.test(value)) return;

    // don't update if is an infeasible amount of Ether (> 100x entire circulating supply as of Aug 2018)
    if (!isNaN(value) && Number(value) > 10000000000) return;

    if (!isNaN(value)) {
      this.setState({ amountToWithdraw: new BigNumber(value) });
    }

    // update the input (this could be an invalid number, such as '12.')
    this.setState({ amountToWithdrawInput: value });
  }

  generateTxStatus() {
    const {
      currentWalletWithInfo,
      withdrawals,
      ongoingChallenges,
      settleableChallenges,
      currentNetwork,
      intl,
      ledgerNanoSInfo,
      trezorInfo,
    } = this.props;
    const { formatMessage } = intl;
    const confOnDevice = ledgerNanoSInfo.get('confTxOnDevice') || trezorInfo.get('confTxOnDevice');
    let ratio;
    let type;
    const activities = [withdrawals, ongoingChallenges, settleableChallenges];
    for (const activity of activities) { //eslint-disable-line
      if (activity.get('status') === 'requesting') ratio = '1/2';
      if (activity.get('status') === 'mining') ratio = '2/2';
      if (activity.get('status') === 'receipt') ratio = '2/2';

      if (ratio && activity === withdrawals) type = 'withdraw';
      if (ratio && activity === ongoingChallenges) type = 'start_challenge';
      if (ratio && activity === settleableChallenges) type = 'confirm_settle';

      if (ratio) break;
    }

    if (!ratio) return null;
    const transferingText =
      `${formatMessage({ id: `waiting_for_${type}_to_be` })} ${confOnDevice ? formatMessage({ id: 'signed' }) : `${formatMessage({ id: 'mined' })}...`}`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>
          <Text large>{transferingText}</Text>
          {!confOnDevice && <Icon style={{ color: 'white', fontSize: '1.5rem', marginLeft: '1rem' }} type="loading" />}
        </span>
        {!confOnDevice &&
        <a
          role="link"
          tabIndex={0}
          onClick={
            currentNetwork.provider._network.name === 'ropsten' ?
              () => shell.openExternal(`https://ropsten.etherscan.io/address/${currentWalletWithInfo.get('address')}`) :
              () => shell.openExternal(`https://etherscan.io/address/${currentWalletWithInfo.get('address')}`)
          }
        >
          {'Track progress on Etherscan'}
        </a>
        }
      </div>
    );
  }

  renderSteppers() {
    const {
      assetToWithdraw,
      assetToWithdrawMaxDecimals,
    } = this.state;
    const {
      ongoingChallenges,
      settleableChallenges,
      currentWalletWithInfo,
      intl,
    } = this.props;
    const { formatMessage } = intl;
    const steppers = ['payment-driip', 'null'].map((type) => {
      const paymentDriipOngoingChallenge = ongoingChallenges.get('details').find((challenge) => challenge.type === type);
      const paymentDriipSettleableChallenge = settleableChallenges.get('details').find((challenge) => challenge.type === type);
      const invalidPaymentDriipSettlement = settleableChallenges.get('invalidReasons').find((challenge) => challenge.type === type);

      let currentStage = 0;
      if (paymentDriipOngoingChallenge) {
        currentStage = 1;
      }

      if (paymentDriipSettleableChallenge) {
        currentStage = 2;
      }

      if (invalidPaymentDriipSettlement) {
        invalidPaymentDriipSettlement.reasons.forEach((reason) => {
          if (reason.message.match(/.*can.*not.*replay/)) {
            currentStage = 3;
          }
        });
      }

      return { type, currentStage };
    });

    const stepper = steppers.filter((s) => s.currentStage !== 0).sort((a, b) => a.currentStage - b.currentStage)[0];

    if (!stepper) {
      return null;
    }
    const maxExpirationTime = this.getMaxExpirationTime();
    const totalStagingAmountBN = ongoingChallenges.get('details').concat(settleableChallenges.get('details')).reduce((sum, challenge) => {
      const { intendedStageAmount } = challenge;
      const { amount } = intendedStageAmount.toJSON();
      return sum.plus(new BigNumber(amount));
    }, new BigNumber(0));
    const totalStagingAmount = totalStagingAmountBN.div(new BigNumber(10).pow(assetToWithdrawMaxDecimals));

    const nahmiiStagedAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiStaged', 'assets']).toJS();
    const nahmiiStagedAmount = (nahmiiStagedAssets
      .find((asset) => asset.currency === assetToWithdraw.currency) || { balance: new BigNumber('0') })
      .balance;

    const startSettlementStepDesc = totalStagingAmount.gt(0) ? formatMessage({ id: 'intended_stage_amount' }, { amount: totalStagingAmount, symbol: assetToWithdraw.symbol }) : null;
    const challengeStepDesc = maxExpirationTime ? formatMessage({ id: 'expiration_time' }, { endtime: moment(maxExpirationTime).format('llll') }) : null;
    const challengeStepTitle = maxExpirationTime ? (<Tooltip title={formatMessage({ id: 'challenge_period_endtime' }, { endtime: moment(maxExpirationTime).format('LLLL'), symbol: assetToWithdraw.symbol })} defaultVisible>{formatMessage({ id: 'challenge_period' })}</Tooltip>) : formatMessage({ id: 'challenge_period' });

    return (
      <StyledSteps
        current={stepper.currentStage}
        key={stepper.type}
        className={stepper.type}
      >
        <Step
          title={formatMessage({ id: 'start_challenge' })}
          description={startSettlementStepDesc}
          icon={<Icon type="profile" />}
        />
        <Step
          title={challengeStepTitle}
          description={challengeStepDesc}
          icon={<Icon type="eye-o" />}
        />
        <Step title={formatMessage({ id: 'settlement_qualified' })} icon={<Icon type="check-square-o" />} />
        <Step
          title={formatMessage({ id: 'withdrawable' })}
          description={formatMessage({ id: 'withdrawable_amount' }, { amount: nahmiiStagedAmount, symbol: assetToWithdraw.symbol })}
          icon={<Icon type="logout" />}
        />
      </StyledSteps>
    );
  }

  render() {
    const {
      assetToWithdraw,
      amountToWithdrawInput,
      amountToWithdraw,
      gasPriceGwei,
      gasLimit,
      assetToWithdrawMaxDecimals,
    } = this.state;
    const {
      currentWalletWithInfo,
      prices,
      gasStatistics,
      intl,
      supportedAssets,
      ledgerNanoSInfo,
      trezorInfo,
      settleableChallenges,
    } = this.props;
    const { formatMessage } = intl;

    if
    (
      currentWalletWithInfo.getIn(['balances', 'combined', 'loading']) ||
      supportedAssets.get('loading') ||
      prices.get('loading')
    ) {
      return (
        <LoadingWrapper>
          <StyledSpin size="large" tip={formatMessage({ id: 'synchronising' })}></StyledSpin>
        </LoadingWrapper>
      );
    }
    if
    (
      currentWalletWithInfo.getIn(['balances', 'combined', 'error']) ||
      supportedAssets.get('error') ||
      prices.get('error')
    ) {
      return <NoTxPlaceholder>{formatMessage({ id: 'connection_problem' })}</NoTxPlaceholder>;
    }

    const baseLayerAssets = currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const nahmiiCombinedAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'assets']).toJS();
    const nahmiiStagedAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiStaged', 'assets']).toJS();

    const nahmiiAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiAvailable', 'assets']).toJS();
    const assetToWithdrawUsdValue = prices.toJS().assets
      .find((a) => a.currency === assetToWithdraw.currency).usd;
    const usdValueToWithdraw = amountToWithdraw
      .times(assetToWithdrawUsdValue);
    const ethUsdValue = prices.toJS().assets
      .find((a) => a.currency === '0x0000000000000000000000000000000000000000').usd;
    const baseLayerEthBalance = baseLayerAssets
      .find((currency) => currency.symbol === 'ETH');

    // construct tx fee info
    const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
    const txFeeUsdValue = txFeeAmt.times(ethUsdValue);
    const transactionFee = {
      amount: txFeeAmt,
      usdValue: txFeeUsdValue,
    };

    // construct asset before and after balances
    const baseLayerAsset = baseLayerAssets.find((a) => a.symbol === assetToWithdraw.symbol) || {
      symbol: assetToWithdraw.symbol,
      currency: assetToWithdraw.currency,
      balance: new BigNumber('0'),
    };
    const baseLayerBalanceBefore = {
      amount: baseLayerAsset.balance,
      usdValue: baseLayerAsset.balance.times(assetToWithdrawUsdValue),
    };
    const nahmiiBalanceBeforeAmt = (nahmiiAssets
      .find((asset) => asset.currency === assetToWithdraw.currency) || { balance: new BigNumber('0') })
      .balance;
    const nahmiiBalanceBefore = {
      amount: nahmiiBalanceBeforeAmt,
      usdValue: nahmiiBalanceBeforeAmt.times(assetToWithdrawUsdValue),
    };
    const nahmiiStagedBalanceBeforeAmt = (nahmiiStagedAssets
      .find((asset) => asset.currency === assetToWithdraw.currency) || { balance: new BigNumber('0') })
      .balance;
    const nahmiiStagedBalanceBefore = {
      amount: nahmiiStagedBalanceBeforeAmt,
      usdValue: nahmiiStagedBalanceBeforeAmt.times(assetToWithdrawUsdValue),
    };
    const nahmiiStagedBalanceAfterAmt = nahmiiStagedBalanceBeforeAmt.minus(amountToWithdraw);
    const nahmiiStagedBalanceAfter = {
      amount: nahmiiStagedBalanceAfterAmt,
      usdValue: nahmiiStagedBalanceAfterAmt.times(assetToWithdrawUsdValue),
    };
    const baseLayerBalAfterAmt = baseLayerBalanceBefore.amount.plus(amountToWithdraw);
    const baseLayerBalanceAfter = {
      amount: baseLayerBalAfterAmt,
      usdValue: baseLayerBalAfterAmt.times(assetToWithdrawUsdValue),
    };

    // constuct ether before and after balances
    const baseLayerEthBalanceBefore = {
      amount: baseLayerEthBalance.balance,
      usdValue: baseLayerEthBalance.balance.times(ethUsdValue),
    };

    const stagedAsset = nahmiiStagedAssets.find((a) => a.symbol === assetToWithdraw.symbol) || { balance: new BigNumber(0) };
    const requiredSettlementAmount = this.getRequiredSettlementAmount(stagedAsset.balance, amountToWithdraw);

    let baseLayerEthBalanceAfterAmount = baseLayerEthBalanceBefore.amount.minus(transactionFee.amount);
    if (requiredSettlementAmount.eq(0) && assetToWithdraw.symbol === 'ETH') {
      baseLayerEthBalanceAfterAmount = baseLayerEthBalanceAfterAmount.plus(amountToWithdraw);
    }
    const baseLayerEthBalanceAfter = {
      amount: baseLayerEthBalanceAfterAmount,
      usdValue: baseLayerEthBalanceAfterAmount.times(ethUsdValue),
    };

    const nahmiiBalanceAfterStagingAmt = nahmiiBalanceBeforeAmt.minus(requiredSettlementAmount);
    const nahmiiBalanceAfterStaging = {
      amount: nahmiiBalanceAfterStagingAmt,
      usdValue: nahmiiBalanceAfterStagingAmt.times(assetToWithdrawUsdValue),
    };
    const totalSettleableStageAmountBN = settleableChallenges.get('details').reduce((sum, challenge) => {
      const { amount } = challenge.intendedStageAmount.toJSON();
      const intendedStageAmount = new BigNumber(amount);
      return sum.plus(intendedStageAmount);
    }, new BigNumber(0));

    const totalSettleableStageAmount = totalSettleableStageAmountBN.div(new BigNumber(10).pow(assetToWithdrawMaxDecimals));

    const walletType = currentWalletWithInfo.get('type');
    const disableWithdrawButton =
      amountToWithdraw.toNumber() <= 0 ||
      baseLayerBalAfterAmt.isNegative() ||
      baseLayerEthBalanceAfterAmount.isNegative() ||
      !walletReady(walletType, ledgerNanoSInfo, trezorInfo);

    const disableSettleButton =
      baseLayerEthBalanceAfterAmount.isNegative() ||
      nahmiiBalanceAfterStagingAmt.isNegative() ||
      !walletReady(walletType, ledgerNanoSInfo, trezorInfo);
    const disableConfirmSettleButton = !walletReady(walletType, ledgerNanoSInfo, trezorInfo);
    const TxStatus = this.generateTxStatus();

    return (
      <ContentWrapper>
        <ScrollableContentWrapper style={{ flex: 1 }}>
          <div style={{ display: 'flex', flex: '1', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div style={{ flex: '1', marginRight: '2rem', marginBottom: '3rem' }}>
              <Form>
                <FormItem
                  label={<FormItemLabel>{formatMessage({ id: 'select_asset_to_withdraw' })}</FormItemLabel>}
                  colon={false}
                >
                  <Image
                    src={getAbsolutePath(`public/images/assets/${assetToWithdraw.symbol}.svg`)}
                    onError={assetImageFallback}
                    alt="logo"
                  />
                  <Select
                    // disabled={transfering}
                    defaultValue={assetToWithdraw.symbol}
                    onSelect={this.handleAssetChange}
                    style={{ paddingLeft: '0.5rem' }}
                  >
                    {nahmiiCombinedAssets.map((currency) => (
                      <Option value={currency.symbol} key={currency.symbol}>
                        {currency.symbol}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem
                  label={<FormItemLabel>{formatMessage({ id: 'enter_amount_withdraw' })} </FormItemLabel>}
                  colon={false}
                  help={<HelperText left={formatFiat(usdValueToWithdraw, 'USD')} right={formatMessage({ id: 'usd' })} />}
                >
                  <Input
                    className="withdraw-input"
                    defaultValue={amountToWithdrawInput}
                    value={amountToWithdrawInput}
                    onFocus={() => this.onFocusNumberInput('amountToWithdrawInput')}
                    onBlur={() => this.onBlurNumberInput('amountToWithdrawInput')}
                    onChange={this.handleAmountToWithdrawChange}
                  />
                </FormItem>
                {
                  requiredSettlementAmount.gt(0) &&
                    (
                      <Alert
                        className="why-settlement-notes"
                        message={formatMessage({ id: 'withdraw_exceeded_staged_amount' })}
                        description={
                          formatMessage(
                            { id: 'why_settlement_notes' },
                            {
                              symbol: assetToWithdraw.symbol,
                              withdraw_amount: amountToWithdraw,
                              required_stage_amout: requiredSettlementAmount,
                              staged_amount: nahmiiStagedBalanceBefore.amount,
                            }
                          )
                        }
                        type="info"
                        showIcon
                      />
                    )
                }
                <GasOptions
                  intl={intl}
                  defaultGasLimit={gasLimit}
                  defaultGasPrice={gasPriceGwei.toNumber()}
                  gasStatistics={gasStatistics.get('estimate')}
                  defaultOption="average"
                  onChange={this.onGasChange}
                />
                <DollarPrice>
                  {`1 ${assetToWithdraw.symbol} = ${formatFiat(assetToWithdrawUsdValue, 'USD')}`}
                </DollarPrice>
              </Form>
            </div>
            <div style={{ flex: '0.5', minWidth: '34rem', marginBottom: '3rem' }}>
              {
                settleableChallenges.get('details').length > 0 ?
                (<SettlementWarning
                  className="confirm-settlement"
                  message={formatMessage({ id: 'settlement_period_ended' })}
                  description={
                    <div>
                      <div>
                        {formatMessage({ id: 'settlement_period_ended_notice' }, { symbol: assetToWithdraw.symbol, intended_stage_amount: totalSettleableStageAmount, tx_count: settleableChallenges.get('details').length })}
                      </div>
                      {
                        TxStatus ?
                          (
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="confirm-tx-status">
                              {TxStatus}
                            </div>
                          ) : (
                            <StyledButton className="confirm-btn" onClick={() => this.settle(assetToWithdraw)} disabled={disableConfirmSettleButton}>
                              {formatMessage({ id: 'confirm_settlement' })}
                            </StyledButton>
                          )
                      }
                    </div>
                  }
                  type="warning"
                  showIcon
                />) : (
                  requiredSettlementAmount.gt(0) ?
                  (
                    <div className="start-settlement">
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'base_layer_fee' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          main={<SelectableText><NumericText value={transactionFee.amount.toString()} /> {'ETH'}</SelectableText>}
                          subtitle={<NumericText value={transactionFee.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'base_layer' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          className="base-layer-eth-balance-before"
                          main={<SelectableText><NumericText value={baseLayerEthBalanceBefore.amount.toString()} /> {'ETH'}</SelectableText>}
                          subtitle={<NumericText value={baseLayerEthBalanceBefore.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>
                          {formatMessage({ id: 'base_layer' })} ETH {formatMessage({ id: 'balance_after' })}
                        </StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          className="base-layer-eth-balance-after"
                          main={<SelectableText><NumericText value={baseLayerEthBalanceAfter.amount.toString()} /> {'ETH'}</SelectableText>}
                          subtitle={<NumericText value={baseLayerEthBalanceAfter.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'required_stage_amount' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          main={<SelectableText><NumericText value={requiredSettlementAmount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                          subtitle={<NumericText value={requiredSettlementAmount.times(assetToWithdrawUsdValue).toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'nahmii_available' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          className="nahmii-balance-before-staging"
                          main={<SelectableText><NumericText value={nahmiiBalanceBefore.amount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                          subtitle={<NumericText value={nahmiiBalanceBefore.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>
                          {formatMessage({ id: 'nahmii_available' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_after' })}
                        </StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          className="nahmii-balance-after-staging"
                          main={<SelectableText><NumericText value={nahmiiBalanceAfterStaging.amount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                          subtitle={<NumericText value={nahmiiBalanceAfterStaging.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        {
                        TxStatus ?
                          (
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="challenge-tx-status">
                              {TxStatus}
                            </div>
                          ) : (
                            <StyledButton className="challenge-btn" onClick={() => this.startChallenge(requiredSettlementAmount, assetToWithdraw)} disabled={disableSettleButton}>
                              {formatMessage({ id: 'settle_balance' })}
                            </StyledButton>
                          )
                      }
                      </Row>
                    </div>
                  ) : (
                    <div className="withdraw-review">
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'withdraw' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          main={<SelectableText><NumericText value={amountToWithdraw.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                          subtitle={<NumericText value={usdValueToWithdraw.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'base_layer_fee' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          main={<SelectableText><NumericText value={transactionFee.amount.toString()} /> {'ETH'}</SelectableText>}
                          subtitle={<NumericText value={transactionFee.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>{formatMessage({ id: 'base_layer' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          className="base-layer-eth-balance-before"
                          main={<SelectableText><NumericText value={baseLayerEthBalanceBefore.amount.toString()} /> {'ETH'}</SelectableText>}
                          subtitle={<NumericText value={baseLayerEthBalanceBefore.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      <Row>
                        <StyledCol span={12}>
                          {formatMessage({ id: 'base_layer' })} ETH {formatMessage({ id: 'balance_after' })}
                        </StyledCol>
                      </Row>
                      <Row>
                        <TransferDescriptionItem
                          className="base-layer-eth-balance-after"
                          main={<SelectableText><NumericText value={baseLayerEthBalanceAfter.amount.toString()} /> {'ETH'}</SelectableText>}
                          subtitle={<NumericText value={baseLayerEthBalanceAfter.usdValue.toString()} type="currency" />}
                        />
                      </Row>
                      {assetToWithdraw.symbol === 'ETH' &&
                      <div>
                        <Row>
                          <StyledCol span={12}>{formatMessage({ id: 'nahmii_staged' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
                        </Row>
                        <Row>
                          <TransferDescriptionItem
                            className="staged-balance-before"
                            main={<SelectableText><NumericText value={nahmiiStagedBalanceBefore.amount.toString()} /> {'ETH'}</SelectableText>}
                            subtitle={<NumericText value={nahmiiStagedBalanceBefore.usdValue.toString()} type="currency" />}
                          />
                        </Row>
                        <Row>
                          <StyledCol span={12}>
                            {formatMessage({ id: 'nahmii_staged' })} ETH {formatMessage({ id: 'balance_after' })}
                          </StyledCol>
                        </Row>
                        <Row>
                          <TransferDescriptionItem
                            className="staged-balance-after"
                            main={<SelectableText><NumericText value={nahmiiStagedBalanceAfter.amount.toString()} /> {'ETH'}</SelectableText>}
                            subtitle={<NumericText value={nahmiiStagedBalanceAfter.usdValue.toString()} type="currency" />}
                          />
                        </Row>
                      </div>
                      }
                      {assetToWithdraw.symbol !== 'ETH' &&
                      <div>
                        <Row>
                          <StyledCol span={12}>{formatMessage({ id: 'base_layer' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
                        </Row>
                        <Row>
                          <TransferDescriptionItem
                            className="base-layer-token-balance-before"
                            main={<SelectableText><NumericText value={baseLayerBalanceBefore.amount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                            subtitle={<NumericText value={baseLayerBalanceBefore.usdValue.toString()} type="currency" />}
                          />
                        </Row>
                        <Row>
                          <StyledCol span={12}>
                            {formatMessage({ id: 'base_layer' })} { assetToWithdraw.symbol } {formatMessage({ id: 'balance_after' })}
                          </StyledCol>
                        </Row>
                        <Row>
                          <TransferDescriptionItem
                            className="base-layer-token-balance-after"
                            main={<SelectableText><NumericText value={baseLayerBalanceAfter.amount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                            subtitle={<NumericText value={baseLayerBalanceAfter.usdValue.toString()} type="currency" />}
                          />
                        </Row>
                        <Row>
                          <StyledCol span={12}>{formatMessage({ id: 'nahmii_staged' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
                        </Row>
                        <Row>
                          <TransferDescriptionItem
                            className="staged-balance-before"
                            main={<SelectableText><NumericText value={nahmiiStagedBalanceBefore.amount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                            subtitle={<NumericText value={nahmiiStagedBalanceBefore.usdValue.toString()} type="currency" />}
                          />
                        </Row>
                        <Row>
                          <StyledCol span={12}>
                            {formatMessage({ id: 'nahmii_staged' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_after' })}
                          </StyledCol>
                        </Row>
                        <Row>
                          <TransferDescriptionItem
                            className="staged-balance-after"
                            main={<SelectableText><NumericText value={nahmiiStagedBalanceAfter.amount.toString()} /> {assetToWithdraw.symbol}</SelectableText>}
                            subtitle={<NumericText value={nahmiiStagedBalanceAfter.usdValue.toString()} type="currency" />}
                          />
                        </Row>
                      </div>
                      }
                      <Row>
                        {
                        TxStatus ?
                          (
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="withdraw-status">
                              {TxStatus}
                            </div>
                          ) : (
                            <StyledButton
                              type="primary"
                              className="withdraw-btn"
                              onClick={() => this.withdraw(amountToWithdraw, assetToWithdraw)}
                              disabled={disableWithdrawButton}
                            >
                              <span>{formatMessage({ id: 'withdraw' })}</span>
                            </StyledButton>
                            )
                          }
                      </Row>
                    </div>
                  )
                )
              }
              {
                isHardwareWallet(currentWalletWithInfo.get('type')) &&
                <HWPromptWrapper>
                  <HWPromptContainer />
                </HWPromptWrapper>
              }
            </div>
          </div>
        </ScrollableContentWrapper>
        <BottomWrapper>
          <div style={{ flex: 1 }}>
            {this.renderSteppers()}
          </div>
        </BottomWrapper>
      </ContentWrapper>
    );
  }
}

NahmiiWithdraw.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  ongoingChallenges: PropTypes.object.isRequired,
  settleableChallenges: PropTypes.object.isRequired,
  withdrawals: PropTypes.object.isRequired,
  setSelectedWalletCurrency: PropTypes.func.isRequired,
  startChallenge: PropTypes.func.isRequired,
  settle: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
  gasStatistics: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  prices: makeSelectPrices(),
  supportedAssets: makeSelectSupportedAssets(),
  currentNetwork: makeSelectCurrentNetwork(),
  ongoingChallenges: makeSelectOngoingChallengesForCurrentWalletCurrency(),
  settleableChallenges: makeSelectSettleableChallengesForCurrentWalletCurrency(),
  withdrawals: makeSelectWithdrawalsForCurrentWalletCurrency(),
  gasStatistics: makeSelectGasStatistics(),
});

function mapDispatchToProps(dispatch) {
  return {
    startChallenge: (...args) => dispatch(startChallenge(...args)),
    settle: (...args) => dispatch(settle(...args)),
    withdraw: (...args) => dispatch(withdraw(...args)),
    goWalletDetails: (address) => dispatch(push(`/wallet/${address}/overview`)),
    setSelectedWalletCurrency: (...args) => dispatch(setSelectedWalletCurrency(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiWithdraw);
