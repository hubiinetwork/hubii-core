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
import { Row, Icon } from 'antd';
import { getAbsolutePath } from 'utils/electron';
import {
  gweiToEther,
  gweiToWei,
  gweiRegex,
  gasLimitRegex,
  isHardwareWallet,
  walletReady,
} from 'utils/wallet';
import BigNumber from 'bignumber.js';
import { formatFiat } from 'utils/numberFormats';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import Collapse, { Panel } from 'components/ui/Collapse';
import HelperText from 'components/ui/HelperText';
import Text from 'components/ui/Text';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import TransferDescriptionItem from 'components/TransferDescriptionItem';
import HWPromptContainer from 'containers/HWPromptContainer';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
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
  AdvancedSettingsHeader,
  Image,
  DollarPrice,
  StyledCol,
  StyledSpin,
  StyledButton,
  HWPromptWrapper,
  LoadingWrapper,
  NoTxPlaceholder,
  SettlementWarning,
} from './style';


export class NahmiiWithdraw extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const baseLayerAssets = props.currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const assetToWithdraw = baseLayerAssets[0] || { symbol: 'ETH', currency: 'ETH', balance: new BigNumber('0') };

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
      gasLimit: 1000000,
      gasLimitInput: '1000000',
      addContactModalVisibility: false,
    };
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
    this.handleAmountToWithdrawChange = this.handleAmountToWithdrawChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.generateTransferingStatus = this.generateTransferingStatus.bind(this);
    this.getRequiredSettlementAmount = this.getRequiredSettlementAmount.bind(this);
    this.startChallenge = this.startChallenge.bind(this);
    this.settle = this.settle.bind(this);
    this.withdraw = this.withdraw.bind(this);

    props.setSelectedWalletCurrency('0x0000000000000000000000000000000000000000');
  }

  componentDidUpdate(prevProps) {
    const { assetToWithdraw } = this.state;
    const { currentWalletWithInfo } = this.props;

    const baseLayerAssets = currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const asset = baseLayerAssets.find((a) => a.symbol === assetToWithdraw.symbol);
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

  getRequiredSettlementAmount(stagedAmount, amountToWithdraw) {
    if (amountToWithdraw.gt(stagedAmount)) {
      return amountToWithdraw.minus(stagedAmount);
    }
    return 0;
  }

  settle(assetToWithdraw) {
    const { currentWalletWithInfo } = this.props;
    const { gasLimit, gasPriceGwei } = this.state;
    const currency = assetToWithdraw.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetToWithdraw.currency;
    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };
    this.props.settle(currentWalletWithInfo.get('address'), currency, options);
  }

  startChallenge(stageAmount, assetToWithdraw) {
    const { currentWalletWithInfo } = this.props;
    const { assetToWithdrawMaxDecimals, gasLimit, gasPriceGwei } = this.state;
    const currency = assetToWithdraw.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetToWithdraw.currency;
    const stageAmountBN = stageAmount.times(new BigNumber(10).pow(assetToWithdrawMaxDecimals));
    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };
    this.props.startChallenge(currentWalletWithInfo.get('address'), currency, stageAmountBN, options);
  }

  withdraw(amountToWithdraw, assetToWithdraw) {
    const { currentWalletWithInfo } = this.props;
    const { assetToWithdrawMaxDecimals, gasLimit, gasPriceGwei } = this.state;
    const currency = assetToWithdraw.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetToWithdraw.currency;
    const amountToWithdrawBN = amountToWithdraw.times(new BigNumber(10).pow(assetToWithdrawMaxDecimals));
    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };
    this.props.withdraw(amountToWithdrawBN, currentWalletWithInfo.get('address'), currency, options);
  }

  handleAssetChange(newSymbol) {
    const { currentWalletWithInfo, supportedAssets } = this.props;
    const baseLayerAssets = currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const assetToWithdraw = baseLayerAssets.find((a) => a.symbol === newSymbol);

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

  generateTransferingStatus() {
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

  render() {
    const {
      assetToWithdraw,
      gasLimitInput,
      gasPriceGweiInput,
      amountToWithdrawInput,
      amountToWithdraw,
      gasPriceGwei,
      gasLimit,
      assetToWithdrawMaxDecimals,
    } = this.state;
    const {
      currentWalletWithInfo,
      prices,
      intl,
      supportedAssets,
      ledgerNanoSInfo,
      trezorInfo,
      ongoingChallenges,
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
    const nahmiiStagedAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiStaged', 'assets']).toJS();

    const nahmiiAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'assets']).toJS();
    const assetToWithdrawUsdValue = prices.toJS().assets
      .find((a) => a.currency === assetToWithdraw.currency).usd;
    const usdValueToWithdraw = amountToWithdraw
      .times(assetToWithdrawUsdValue);
    const ethUsdValue = prices.toJS().assets
      .find((a) => a.currency === 'ETH').usd;
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
    const baseLayerBalanceBefore = {
      amount: assetToWithdraw.balance,
      usdValue: assetToWithdraw.balance.times(assetToWithdrawUsdValue),
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
    const baseLayerEthBalanceAfterAmount = assetToWithdraw.symbol === 'ETH'
        ? baseLayerEthBalanceBefore.amount.plus(amountToWithdraw).minus(transactionFee.amount)
        : baseLayerEthBalanceBefore.amount.minus(transactionFee.amount);
    const baseLayerEthBalanceAfter = {
      amount: baseLayerEthBalanceAfterAmount,
      usdValue: baseLayerEthBalanceAfterAmount.times(ethUsdValue),
    };

    const maxExpirationTime = ongoingChallenges.get('details').reduce((max, challenge) => {
      const { expirationTime } = challenge;
      return max > expirationTime ? max : expirationTime;
    }, 0);
    const totalStagingAmountBN = ongoingChallenges.get('details').reduce((sum, challenge) => {
      const { intendedStageAmount } = challenge;
      const { amount } = intendedStageAmount.toJSON();
      return sum.plus(new BigNumber(amount));
    }, new BigNumber(0));
    const totalStagingAmount = totalStagingAmountBN.div(new BigNumber(10).pow(assetToWithdrawMaxDecimals));

    const stagedAsset = nahmiiStagedAssets.find((a) => a.symbol === assetToWithdraw.symbol) || { balance: new BigNumber(0) };
    const requiredSettlementAmount = this.getRequiredSettlementAmount(stagedAsset.balance, amountToWithdraw);
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

    const disableSettleButton = nahmiiBalanceAfterStagingAmt.isNegative() || !walletReady(walletType, ledgerNanoSInfo, trezorInfo);
    const disableConfirmSettleButton = !walletReady(walletType, ledgerNanoSInfo, trezorInfo);
    const TransferingStatus = this.generateTransferingStatus();

    return (
      <div style={{ display: 'flex', flex: '1', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', marginRight: '2rem', marginBottom: '3rem' }}>
          <Form>
            <FormItem
              label={<FormItemLabel>{formatMessage({ id: 'select_asset_to_withdraw' })}</FormItemLabel>}
              colon={false}
            >
              <Image
                src={getAbsolutePath(`public/images/assets/${assetToWithdraw.symbol}.svg`)}
                alt="logo"
              />
              <Select
                // disabled={transfering}
                defaultValue={assetToWithdraw.symbol}
                onSelect={this.handleAssetChange}
                style={{ paddingLeft: '0.5rem' }}
              >
                {baseLayerAssets.map((currency) => (
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
            <Collapse bordered={false} defaultActiveKey={['2']}>
              <Panel
                header={<AdvancedSettingsHeader>{formatMessage({ id: 'advanced_settings' })}</AdvancedSettingsHeader>}
                key="1"
              >
                <FormItem label={<FormItemLabel>{formatMessage({ id: 'gas_price' })}</FormItemLabel>} colon={false}>
                  <Input
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
                    value={gasLimitInput}
                    defaultValue={gasLimitInput}
                    onChange={this.handleGasLimitChange}
                    onFocus={() => this.onFocusNumberInput('gasLimitInput')}
                    onBlur={() => this.onBlurNumberInput('gasLimitInput')}
                  />
                </FormItem>
              </Panel>
            </Collapse>
            <DollarPrice>
              {`1 ${assetToWithdraw.symbol} = ${formatFiat(assetToWithdrawUsdValue, 'USD')}`}
            </DollarPrice>
          </Form>
        </div>
        <div style={{ flex: 1, minWidth: '34rem' }}>
          {
            ongoingChallenges.get('details').length > 0 &&
            <SettlementWarning
              className="ongoing-challenges"
              message={formatMessage({ id: 'challenge_period_progress' }, { staging_amount: totalStagingAmount.toString(), symbol: assetToWithdraw.symbol })}
              description={formatMessage({ id: 'challenge_period_endtime' }, { endtime: moment(maxExpirationTime).format('LLLL'), symbol: assetToWithdraw.symbol })}
              type="warning"
              showIcon
            />
          }
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
                    TransferingStatus ?
                      (
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="confirm-tx-status">
                          {TransferingStatus}
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
              requiredSettlementAmount ?
              (
                <div className="start-settlement">
                  <Row>
                    <StyledCol span={12}>{formatMessage({ id: 'required_stage_amount' })}</StyledCol>
                  </Row>
                  <Row>
                    <TransferDescriptionItem
                      main={`${requiredSettlementAmount} ${assetToWithdraw.symbol}`}
                      subtitle={formatFiat(requiredSettlementAmount.times(assetToWithdrawUsdValue), 'USD')}
                    />
                  </Row>
                  <Row>
                    <StyledCol span={12}>{formatMessage({ id: 'nahmii' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
                  </Row>
                  <Row>
                    <TransferDescriptionItem
                      className="nahmii-balance-before-staging"
                      main={`${nahmiiBalanceBefore.amount.toString()} ${assetToWithdraw.symbol}`}
                      subtitle={formatFiat(nahmiiBalanceBefore.usdValue.toNumber(), 'USD')}
                    />
                  </Row>
                  <Row>
                    <StyledCol span={12}>
                      {formatMessage({ id: 'nahmii' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_after' })}
                    </StyledCol>
                  </Row>
                  <Row>
                    <TransferDescriptionItem
                      className="nahmii-balance-after-staging"
                      main={`${nahmiiBalanceAfterStaging.amount} ${assetToWithdraw.symbol}`}
                      subtitle={formatFiat(nahmiiBalanceAfterStaging.usdValue.toNumber(), 'USD')}
                    />
                  </Row>
                  <Row>
                    {
                    TransferingStatus ?
                      (
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="challenge-tx-status">
                          {TransferingStatus}
                        </div>
                      ) : (
                        <StyledButton className="challenge-btn" onClick={() => this.startChallenge(requiredSettlementAmount, assetToWithdraw)} disabled={disableSettleButton}>
                          {formatMessage({ id: 'settle_payment' })}
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
                      main={`${amountToWithdraw.toString()} ${assetToWithdraw.symbol}`}
                      subtitle={formatFiat(usdValueToWithdraw.toNumber(), 'USD')}
                    />
                  </Row>
                  <Row>
                    <StyledCol span={12}>{formatMessage({ id: 'base_layer_fee' })}</StyledCol>
                  </Row>
                  <Row>
                    <TransferDescriptionItem
                      main={`${transactionFee.amount.toString()} ETH`}
                      subtitle={formatFiat(transactionFee.usdValue.toNumber(), 'USD')}
                    />
                  </Row>
                  <Row>
                    <StyledCol span={12}>{formatMessage({ id: 'base_layer' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
                  </Row>
                  <Row>
                    <TransferDescriptionItem
                      className="base-layer-eth-balance-before"
                      main={`${baseLayerEthBalanceBefore.amount.toString()} ETH`}
                      subtitle={formatFiat(baseLayerEthBalanceBefore.usdValue.toNumber(), 'USD')}
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
                      main={`${baseLayerEthBalanceAfter.amount} ETH`}
                      subtitle={formatFiat(baseLayerEthBalanceAfter.usdValue.toNumber(), 'USD')}
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
                        main={`${nahmiiStagedBalanceBefore.amount.toString()} ETH`}
                        subtitle={formatFiat(nahmiiStagedBalanceBefore.usdValue.toNumber(), 'USD')}
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
                        main={`${nahmiiStagedBalanceAfter.amount} ETH`}
                        subtitle={formatFiat(nahmiiStagedBalanceAfter.usdValue.toNumber(), 'USD')}
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
                        main={`${baseLayerBalanceBefore.amount} ${assetToWithdraw.symbol}`}
                        subtitle={formatFiat(baseLayerBalanceBefore.usdValue.toNumber(), 'USD')}
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
                        main={`${baseLayerBalanceAfter.amount} ${assetToWithdraw.symbol}`}
                        subtitle={formatFiat(baseLayerBalanceAfter.usdValue.toNumber(), 'USD')}
                      />
                    </Row>
                    <Row>
                      <StyledCol span={12}>{formatMessage({ id: 'nahmii_staged' })} {assetToWithdraw.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
                    </Row>
                    <Row>
                      <TransferDescriptionItem
                        className="staged-balance-before"
                        main={`${nahmiiStagedBalanceBefore.amount.toString()} ${assetToWithdraw.symbol}`}
                        subtitle={formatFiat(nahmiiStagedBalanceBefore.usdValue.toNumber(), 'USD')}
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
                        main={`${nahmiiStagedBalanceAfter.amount} ${assetToWithdraw.symbol}`}
                        subtitle={formatFiat(nahmiiStagedBalanceAfter.usdValue.toNumber(), 'USD')}
                      />
                    </Row>
                  </div>
                  }
                  <Row>
                    {
                    TransferingStatus ?
                      (
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="withdraw-status">
                          {TransferingStatus}
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
