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
import { Row, Icon } from 'antd';
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
import SectionHeading from 'components/ui/SectionHeading';
import Input from 'components/ui/Input';
import Select, { Option } from 'components/ui/Select';
import TransferDescriptionItem from 'components/TransferDescriptionItem';
import HWPromptContainer from 'containers/HWPromptContainer';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { makeSelectGasStatistics } from 'containers/EthOperationsHoc/selectors';
import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';
import { makeSelectLedgerHoc } from 'containers/LedgerHoc/selectors';
import { makeSelectTrezorHoc } from 'containers/TrezorHoc/selectors';
import { makeSelectDepositStatus } from 'containers/NahmiiHoc/selectors';
import { makeSelectCurrentWalletWithInfo } from 'containers/NahmiiHoc/combined-selectors';
import { nahmiiDeposit } from 'containers/NahmiiHoc/actions';
import { injectIntl } from 'react-intl';
import GasOptions from 'components/GasOptions';

import {
  Image,
  DollarPrice,
  StyledNumericText,
  StyledCol,
  StyledSpin,
  StyledButton,
  HWPromptWrapper,
  LoadingWrapper,
  NoTxPlaceholder,
} from './style';
import ScrollableContentWrapper from '../../components/ui/ScrollableContentWrapper';


export class NahmiiDeposit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const baseLayerAssets = props.currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const assetToDeposit = baseLayerAssets[0] || { symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000', balance: new BigNumber('0') };

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
      gasPriceGwei: new BigNumber('10'),
      gasLimit: 600000,
      addContactModalVisibility: false,
    };
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
    this.onGasChange = this.onGasChange.bind(this);
    this.handleAmountToDepositChange = this.handleAmountToDepositChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
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

  onGasChange(fee, gasLimit, gasPriceGwei) {
    this.setState({ gasLimit: gasLimit.toNumber(), gasPriceGwei });
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
      amountToDepositInput,
      amountToDeposit,
      gasPriceGwei,
      gasLimit,
    } = this.state;
    const {
      currentWalletWithInfo,
      prices,
      gasStatistics,
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
      .find((a) => a.currency === '0x0000000000000000000000000000000000000000').usd;
    const baseLayerEthBalance = baseLayerAssets
      .find((currency) => currency.symbol === 'ETH');

    // construct tx fee info
    let txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
    if (assetToDeposit.currency !== '0x0000000000000000000000000000000000000000') txFeeAmt = txFeeAmt.times('2');
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

    const disableDepositButton =
      amountToDeposit.toNumber() <= 0 ||
      baseLayerBalAfterAmt.isNegative() ||
      baseLayerEthBalanceAfterAmount.isNegative() ||
      !walletReady(walletType, ledgerNanoSInfo, trezorInfo);
    const TransferingStatus = this.generateTransferingStatus(depositStatus, ledgerNanoSInfo, trezorInfo);
    return (
      <ScrollableContentWrapper>
        <div style={{ display: 'flex', flex: '1', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <div style={{ flex: '1', marginRight: '2rem', marginBottom: '3rem' }}>
            <Form>
              <FormItem
                label={<FormItemLabel>{formatMessage({ id: 'select_asset_to_deposit' })}</FormItemLabel>}
                colon={false}
              >
                <Image
                  src={getAbsolutePath(`public/images/assets/${assetToDeposit.symbol}.svg`)}
                  onError={assetImageFallback}
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
              <GasOptions
                intl={intl}
                defaultGasLimit={gasLimit}
                defaultGasPrice={gasPriceGwei.toNumber()}
                gasStatistics={gasStatistics.get('estimate')}
                defaultOption="average"
                onChange={this.onGasChange}
              />
              <DollarPrice>
                {`1 ${assetToDeposit.symbol} = `}<StyledNumericText value={assetToDepositUsdValue.toString()} type="currency" />
              </DollarPrice>
            </Form>
          </div>
          <div style={{ minWidth: '34rem' }}>
            <Row>
              <StyledCol span={12}>{formatMessage({ id: 'deposit' })}</StyledCol>
            </Row>
            <Row>
              <TransferDescriptionItem
                main={<SelectableText><NumericText value={amountToDeposit.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                subtitle={<NumericText value={usdValueToDeposit.toString()} type="currency" />}
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
                main={<SelectableText><NumericText value={baseLayerEthBalanceAfter.amount.toString()} /> {'ETH'}</SelectableText>}
                subtitle={<NumericText value={baseLayerEthBalanceAfter.usdValue.toString()} type="currency" />}
              />
            </Row>
            {assetToDeposit.symbol === 'ETH' &&
            <div>
              <Row>
                <StyledCol span={12}>{formatMessage({ id: 'nahmii' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
              </Row>
              <Row>
                <TransferDescriptionItem
                  main={<SelectableText><NumericText value={nahmiiBalanceBefore.amount.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                  subtitle={<NumericText value={nahmiiBalanceBefore.usdValue.toString()} type="currency" />}
                />
              </Row>
              <Row>
                <StyledCol span={12}>
                  {formatMessage({ id: 'nahmii' })} ETH {formatMessage({ id: 'balance_after' })}
                </StyledCol>
              </Row>
              <Row>
                <TransferDescriptionItem
                  main={<SelectableText><NumericText value={nahmiiBalanceAfter.amount.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                  subtitle={<NumericText value={nahmiiBalanceAfter.usdValue.toString()} type="currency" />}
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
                  main={<SelectableText><NumericText value={baseLayerBalanceBefore.amount.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                  subtitle={<NumericText value={baseLayerBalanceBefore.usdValue.toString()} type="currency" />}
                />
              </Row>
              <Row>
                <StyledCol span={12}>
                  {formatMessage({ id: 'base_layer' })} { assetToDeposit.symbol } {formatMessage({ id: 'balance_after' })}
                </StyledCol>
              </Row>
              <Row>
                <TransferDescriptionItem
                  main={<SelectableText><NumericText value={baseLayerBalanceAfter.amount.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                  subtitle={<NumericText value={baseLayerBalanceAfter.usdValue.toString()} type="currency" />}
                />
              </Row>
              <Row>
                <StyledCol span={12}>{formatMessage({ id: 'nahmii' })} {assetToDeposit.symbol} {formatMessage({ id: 'balance_before' })}</StyledCol>
              </Row>
              <Row>
                <TransferDescriptionItem
                  main={<SelectableText><NumericText value={nahmiiBalanceBefore.amount.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                  subtitle={<NumericText value={nahmiiBalanceBefore.usdValue.toString()} type="currency" />}
                />
              </Row>
              <Row>
                <StyledCol span={12}>
                  {formatMessage({ id: 'nahmii' })} { assetToDeposit.symbol } {formatMessage({ id: 'balance_after' })}
                </StyledCol>
              </Row>
              <Row>
                <TransferDescriptionItem
                  main={<SelectableText><NumericText value={nahmiiBalanceAfter.amount.toString()} /> {assetToDeposit.symbol}</SelectableText>}
                  subtitle={<NumericText value={nahmiiBalanceAfter.usdValue.toString()} type="currency" />}
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
              {
            TransferingStatus ?
              (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
                  {TransferingStatus}
                </div>
              ) : (
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
                )
              }
            </Row>
            <SectionHeading style={{ marginTop: '2rem', maxWidth: '25rem' }}>
              {formatMessage({ id: 'deposits_note' })}
            </SectionHeading>
          </div>
        </div>
      </ScrollableContentWrapper>
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
  goWalletDetails: PropTypes.func.isRequired,
  gasStatistics: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  depositStatus: makeSelectDepositStatus(),
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  prices: makeSelectPrices(),
  supportedAssets: makeSelectSupportedAssets(),
  currentNetwork: makeSelectCurrentNetwork(),
  gasStatistics: makeSelectGasStatistics(),
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
