/**
 *
 * NahmiiDeposit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { shell } from 'electron';
import { Row, Icon, Tooltip } from 'antd';
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
import NahmiiInfoBtn from 'containers/NahmiiInfoBtn';
import Text from 'components/ui/Text';
import SectionHeading from 'components/ui/SectionHeading';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import TransferDescriptionItem from 'components/TransferDescriptionItem';
import HWPromptContainer from 'containers/HWPromptContainer';
import { makeSelectCurrentWalletWithInfo } from 'containers/WalletHoc/selectors';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import {
  makeSelectDepositStatus,
  makeSelectDisclaimerModal,
} from 'containers/NahmiiHoc/selectors';
import { nahmiiDeposit } from 'containers/NahmiiHoc/actions';
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
} from './style';


export class NahmiiDeposit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const baseLayerAssets = props.currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const assetToDeposit = baseLayerAssets[0] || { symbol: 'ETH', currency: 'ETH', balance: new BigNumber('0') };

    // max decimals possible for current asset
    let assetToDepositMaxDecimals = 18;
    if (props.supportedAssets.get('assets').size !== 0) {
      assetToDepositMaxDecimals = props.supportedAssets && props.supportedAssets
        .get('assets')
        .find((a) => a.get('currency') === assetToDeposit.currency)
        .get('decimals');
    }

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToDepositInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToDepositMaxDecimals}})?$`);

    this.state = {
      amountToDepositInput: '0',
      amountToDeposit: new BigNumber('0'),
      assetToDeposit,
      assetToDepositMaxDecimals,
      amountToDepositInputRegex,
      gasPriceGweiInput: '10',
      gasPriceGwei: new BigNumber('10'),
      gasLimit: 600000,
      addContactModalVisibility: false,
      gasLimitInput: '600000',
    };
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
    this.handleAmountToDepositChange = this.handleAmountToDepositChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this);
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this);
    this.generateTransferingStatus = this.generateTransferingStatus.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { depositStatus, goWalletDetails, currentWalletWithInfo } = this.props;
    const prevFinalDepositStage =
      prevProps.depositStatus.get('depositingEth')
      || prevProps.depositStatus.get('completingTokenDeposit');
    if
      (
        prevFinalDepositStage
        && !depositStatus.get('depositingEth')
        && !depositStatus.get('completingTokenDeposit')
        && !depositStatus.get('error')
        ) goWalletDetails(currentWalletWithInfo.get('address'));
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

  handleAssetChange(newSymbol) {
    const { currentWalletWithInfo, supportedAssets } = this.props;
    const baseLayerAssets = currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const assetToDeposit = baseLayerAssets.find((a) => a.symbol === newSymbol);

    // max decimals possible for current asset
    const assetToDepositMaxDecimals = supportedAssets
      .get('assets')
      .find((a) => a.get('currency') === assetToDeposit.currency)
      .get('decimals');

    // regex for amount input
    // only allow one dot and integers, and not more decimal places than possible for the
    // current asset
    // https://stackoverflow.com/questions/30435918/regex-pattern-to-have-only-one-dot-and-match-integer-and-decimal-numbers
    const amountToDepositInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToDepositMaxDecimals}})?$`);

    this.setState({
      assetToDeposit,
      amountToDepositInputRegex,
      assetToDepositMaxDecimals,
    });
  }

  handleAmountToDepositChange(e) {
    const { value } = e.target;
    const { amountToDepositInputRegex } = this.state;

    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ amountToDepositInput: '', amountToDeposit: new BigNumber('0') });
    }

    // don't update if invalid regex (numbers followed by at most 1 . followed by max possible decimals)
    if (!amountToDepositInputRegex.test(value)) return;

    // don't update if is an infeasible amount of Ether (> 100x entire circulating supply as of Aug 2018)
    if (!isNaN(value) && Number(value) > 10000000000) return;

    // update amount to Deposit if it's a real number
    if (!isNaN(value)) {
      this.setState({ amountToDeposit: new BigNumber(value) });
    }

    // update the input (this could be an invalid number, such as '12.')
    this.setState({ amountToDepositInput: value });
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

  generateTransferingStatus(depositStatus, ledgerNanoSInfo, trezorInfo) {
    const { currentWalletWithInfo, currentNetwork, intl } = this.props;
    const { formatMessage } = intl;
    const confOnDevice = ledgerNanoSInfo.get('confTxOnDevice') || trezorInfo.get('confTxOnDevice');
    let ratio;
    if (depositStatus.get('depositingEth')) ratio = '1/1';
    if (depositStatus.get('approvingTokenDeposit')) ratio = '1/2';
    if (depositStatus.get('completingTokenDeposit')) ratio = '2/2';
    if (!ratio) return null;
    const transferingText =
      `${formatMessage({ id: 'waiting_for_deposit_to_be' }, { ratio })} ${confOnDevice ? formatMessage({ id: 'signed' }) : `${formatMessage({ id: 'mined' })}...`}`;
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
      assetToDeposit,
      gasLimitInput,
      gasPriceGweiInput,
      amountToDepositInput,
      amountToDeposit,
      gasPriceGwei,
      gasLimit,
    } = this.state;
    const {
      currentWalletWithInfo,
      prices,
      intl,
      supportedAssets,
      depositStatus,
      ledgerNanoSInfo,
      trezorInfo,
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
    const nahmiiAssets = currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'assets']).toJS();
    const assetToDepositUsdValue = prices.toJS().assets
      .find((a) => a.currency === assetToDeposit.currency).usd;
    const usdValueToDeposit = amountToDeposit
      .times(assetToDepositUsdValue);
    const ethUsdValue = prices.toJS().assets
      .find((a) => a.currency === 'ETH').usd;
    const baseLayerEthBalance = baseLayerAssets
      .find((currency) => currency.symbol === 'ETH');

    // construct tx fee info
    let txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
    if (assetToDeposit.currency !== 'ETH') txFeeAmt = txFeeAmt.times('2');
    const txFeeUsdValue = txFeeAmt.times(ethUsdValue);
    const transactionFee = {
      amount: txFeeAmt,
      usdValue: txFeeUsdValue,
    };

    // construct asset before and after balances
    const baseLayerBalanceBefore = {
      amount: assetToDeposit.balance,
      usdValue: assetToDeposit.balance.times(assetToDepositUsdValue),
    };
    const nahmiiBalanceBeforeAmt = (nahmiiAssets
      .find((asset) => asset.currency === assetToDeposit.currency) || { balance: new BigNumber('0') })
      .balance;
    const nahmiiBalanceBefore = {
      amount: nahmiiBalanceBeforeAmt,
      usdValue: nahmiiBalanceBeforeAmt.times(assetToDepositUsdValue),
    };
    const nahmiiBalanceAfterAmt = nahmiiBalanceBeforeAmt.plus(amountToDeposit);
    const nahmiiBalanceAfter = {
      amount: nahmiiBalanceAfterAmt,
      usdValue: nahmiiBalanceAfterAmt.times(assetToDepositUsdValue),
    };
    const baseLayerBalAfterAmt = baseLayerBalanceBefore.amount.minus(amountToDeposit);
    const baseLayerBalanceAfter = {
      amount: baseLayerBalAfterAmt,
      usdValue: baseLayerBalAfterAmt.times(assetToDepositUsdValue),
    };

    // constuct ether before and after balances
    const baseLayerEthBalanceBefore = {
      amount: baseLayerEthBalance.balance,
      usdValue: baseLayerEthBalance.balance.times(ethUsdValue),
    };
    const baseLayerEthBalanceAfterAmount = assetToDeposit.symbol === 'ETH'
        ? baseLayerEthBalanceBefore.amount.minus(amountToDeposit).minus(transactionFee.amount)
        : baseLayerEthBalanceBefore.amount.minus(transactionFee.amount);
    const baseLayerEthBalanceAfter = {
      amount: baseLayerEthBalanceAfterAmount,
      usdValue: baseLayerEthBalanceAfterAmount.times(ethUsdValue),
    };

    const walletType = currentWalletWithInfo.get('type');

    const mainnet = this.props.currentNetwork.provider._network.name === 'homestead';
    const enableNahmiiMainnet = this.props.disclaimerModal.get('enableMainnet');
    const showEnablePrompt = mainnet && !enableNahmiiMainnet;
    const disableDepositButton =
      mainnet
      || (!enableNahmiiMainnet && mainnet)
      || amountToDeposit.toNumber() <= 0
      || baseLayerBalAfterAmt.isNegative()
      || baseLayerEthBalanceAfterAmount.isNegative()
      || !walletReady(walletType, ledgerNanoSInfo, trezorInfo);
    const TransferingStatus = this.generateTransferingStatus(depositStatus, ledgerNanoSInfo, trezorInfo);
    return (
      <div style={{ display: 'flex', flex: '1', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', marginRight: '2rem', marginBottom: '3rem' }}>
          <Form>
            <FormItem
              label={<FormItemLabel>{formatMessage({ id: 'select_asset_to_deposit' })}</FormItemLabel>}
              colon={false}
            >
              <Image
                src={getAbsolutePath(`public/images/assets/${assetToDeposit.symbol}.svg`)}
                alt="logo"
              />
              <Select
                // disabled={transfering}
                defaultValue={assetToDeposit.symbol}
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
              label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
              colon={false}
              help={<HelperText left={formatFiat(usdValueToDeposit, 'USD')} right={formatMessage({ id: 'usd' })} />}
            >
              <Input
                defaultValue={amountToDepositInput}
                value={amountToDepositInput}
                onFocus={() => this.onFocusNumberInput('amountToDepositInput')}
                onBlur={() => this.onBlurNumberInput('amountToDepositInput')}
                onChange={this.handleAmountToDepositChange}
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
              {`1 ${assetToDeposit.symbol} = ${formatFiat(assetToDepositUsdValue, 'USD')}`}
            </DollarPrice>
          </Form>
        </div>
        <div style={{ minWidth: '34rem' }}>
          <Row>
            <StyledCol span={12}>Deposit</StyledCol>
          </Row>
          <Row>
            <TransferDescriptionItem
              main={`${amountToDeposit.toString()} ${assetToDeposit.symbol}`}
              subtitle={formatFiat(usdValueToDeposit.toNumber(), 'USD')}
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
              main={`${baseLayerEthBalanceAfter.amount} ETH`}
              subtitle={formatFiat(baseLayerEthBalanceAfter.usdValue.toNumber(), 'USD')}
            />
          </Row>
          {assetToDeposit.symbol === 'ETH' &&
          <div>
            <Row>
              <StyledCol span={12}>{formatMessage({ id: 'nahmii' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={`${nahmiiBalanceBefore.amount.toString()} ETH`}
                subtitle={formatFiat(nahmiiBalanceBefore.usdValue.toNumber(), 'USD')}
              />
            </Row>
            <Row>
              <StyledCol span={12}>
                {formatMessage({ id: 'nahmii' })} ETH {formatMessage({ id: 'balance_after' })}
              </StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={`${nahmiiBalanceAfter.amount} ETH`}
                subtitle={formatFiat(nahmiiBalanceAfter.usdValue.toNumber(), 'USD')}
              />
            </Row>
          </div>
          }
          {assetToDeposit.symbol !== 'ETH' &&
          <div>
            <Row>
              <StyledCol span={12}>{formatMessage({ id: 'base_layer' })} {assetToDeposit.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={`${baseLayerBalanceBefore.amount} ${assetToDeposit.symbol}`}
                subtitle={formatFiat(baseLayerBalanceBefore.usdValue.toNumber(), 'USD')}
              />
            </Row>
            <Row>
              <StyledCol span={12}>
                {formatMessage({ id: 'base_layer' })} { assetToDeposit.symbol } {formatMessage({ id: 'balance_after' })}
              </StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={`${baseLayerBalanceAfter.amount} ${assetToDeposit.symbol}`}
                subtitle={formatFiat(baseLayerBalanceAfter.usdValue.toNumber(), 'USD')}
              />
            </Row>
            <Row>
              <StyledCol span={12}>{formatMessage({ id: 'nahmii' })} {assetToDeposit.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={`${nahmiiBalanceBefore.amount} ${assetToDeposit.symbol}`}
                subtitle={formatFiat(nahmiiBalanceBefore.usdValue.toNumber(), 'USD')}
              />
            </Row>
            <Row>
              <StyledCol span={12}>
                {formatMessage({ id: 'nahmii' })} { assetToDeposit.symbol } {formatMessage({ id: 'balance_after' })}
              </StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={`${nahmiiBalanceAfter.amount} ${assetToDeposit.symbol}`}
                subtitle={formatFiat(nahmiiBalanceAfter.usdValue.toNumber(), 'USD')}
              />
            </Row>
          </div>
          }
          <Row>
            {
            isHardwareWallet(currentWalletWithInfo.get('type')) &&
            <HWPromptWrapper>
              <HWPromptContainer />
            </HWPromptWrapper>
            }
            <div
              style={{
                display: 'flex',
                marginTop: showEnablePrompt ? '1rem' : '0',
                maxWidth: '25rem',
                overflow: 'hidden',
                height: showEnablePrompt ? 'auto' : '0',
              }}
            >
              <SectionHeading style={{ marginBottom: '0' }}>
                nahmii deposits are disabled on mainnet&nbsp;
              </SectionHeading>
              <NahmiiInfoBtn forceIcon />
            </div>
            {
            TransferingStatus ?
              (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
                  {TransferingStatus}
                </div>
              ) : (
                <Tooltip
                  placement="bottom"
                  overlayStyle={!mainnet ? { display: 'none' } : null}
                  title={<span>{formatMessage({ id: 'nahmii_mainnet' })}</span>}
                >
                  <div style={{ width: 'fit-content' }}>
                    <StyledButton
                      type="primary"
                      onClick={() => this.props.nahmiiDeposit(
                    currentWalletWithInfo.get('address'),
                    assetToDeposit.symbol,
                    amountToDeposit,
                    { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() }
                    )}
                      disabled={disableDepositButton}
                    >
                      <span>{formatMessage({ id: 'deposit' })}</span>
                    </StyledButton>
                  </div>
                </Tooltip>
                )
              }
          </Row>
          <SectionHeading style={{ marginTop: '2rem', maxWidth: '25rem' }}>
            Successful deposits will be credited to your nahmii balance after 12 confirmations (~3 minutes)
          </SectionHeading>
        </div>
      </div>
    );
  }
}

NahmiiDeposit.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  depositStatus: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  nahmiiDeposit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  disclaimerModal: PropTypes.object.isRequired,
  goWalletDetails: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  depositStatus: makeSelectDepositStatus(),
  disclaimerModal: makeSelectDisclaimerModal(),
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  prices: makeSelectPrices(),
  supportedAssets: makeSelectSupportedAssets(),
  currentNetwork: makeSelectCurrentNetwork(),
});

function mapDispatchToProps(dispatch) {
  return {
    nahmiiDeposit: (...args) => dispatch(nahmiiDeposit(...args)),
    goWalletDetails: (address) => dispatch(push(`/wallet/${address}/overview`)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiDeposit);
