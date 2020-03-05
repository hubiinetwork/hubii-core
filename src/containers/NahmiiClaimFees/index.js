/**
 *
 * NahmiiClaimFees
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
import Text from 'components/ui/Text';
import NumericText from 'components/ui/NumericText';
import SelectableText from 'components/ui/SelectableText';
import TooltipText from 'components/ui/TooltipText';
import Select, { Option } from 'components/ui/Select';
import TransferDescriptionItem from 'components/TransferDescriptionItem';
import GasOptions from 'components/GasOptions';
import AgreementButton from 'components/AgreementButton';
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
  makeSelectClaimFeesForCurrentWalletCurrency,
} from 'containers/NahmiiHoc/selectors';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/NahmiiHoc/combined-selectors';
import {
  setSelectedWalletCurrency,
  claimFeesForAccruals,
  withdrawFees,
  loadClaimableFees,
  loadWithdrawableFees,
} from 'containers/NahmiiHoc/actions';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';

import {
  ContentWrapper,
  Image,
  DollarPrice,
  StyledCol,
  StyledSpin,
  HWPromptWrapper,
  LoadingWrapper,
  ScrollableContentWrapper,
} from './style';

export class NahmiiClaimFees extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const assetToClaim = { symbol: 'ETH', currency: '0x0000000000000000000000000000000000000000', balance: new BigNumber('0'), decimals: 18 };

    this.state = {
      assetToClaim,
      gasPriceGweiInput: '10',
      gasPriceGwei: new BigNumber('10'),
      gasLimit: 3000000,
      gasLimitInput: '3000000',
    };

    this.onGasChange = this.onGasChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);

    this.refreshData(props.currentWalletWithInfo.get('address'), assetToClaim.currency);
  }

  componentDidUpdate(prevProps) {
    const { assetToClaim } = this.state;
    const { currentWalletWithInfo } = this.props;

    for (const path of [
      ['claiming', 'status'],
      ['withdrawing', 'status'],
    ]) {
      const currentTxStatus = this.props.revenueFees.getIn(path);
      const prevTxStatus = prevProps.revenueFees.getIn(path);
      if (currentTxStatus === 'success' && prevTxStatus !== 'success') {
        this.refreshData(currentWalletWithInfo.get('address'), assetToClaim.currency);
      }
    }
  }

  onGasChange(fee, gasLimit, gasPriceGwei) {
    this.setState({ gasLimit: gasLimit.toNumber(), gasPriceGwei });
  }

  getCurrencyAddress(currency) {
    return currency === 'ETH' ? '0x0000000000000000000000000000000000000000' : currency;
  }

  getSuggestedGasPrice = () => {
    const { gasStatistics } = this.props;
    const estimate = gasStatistics.get('estimate');
    const suggestedGasPrice = estimate ? parseFloat(estimate.average / 10) : 10;
    return suggestedGasPrice;
  }

  getReviewPanel() {
    const {
      assetToClaim,
      gasPriceGwei,
      gasLimit,
    } = this.state;
    const {
      currentWalletWithInfo,
      prices,
      intl,
      revenueFees,
      claimFeesAction,
      withdrawFeesAction,
      ledgerNanoSInfo,
      trezorInfo,
    } = this.props;
    const { formatMessage } = intl;

    const ethUsdValue = prices.toJS().assets
      .find((a) => a.currency === '0x0000000000000000000000000000000000000000').usd;

    const baseLayerAssets = currentWalletWithInfo.getIn(['balances', 'baseLayer', 'assets']).toJS();
    const baseLayerEthBalance = baseLayerAssets
      .find((currency) => currency.symbol === 'ETH');

    const txFeeAmt = gweiToEther(gasPriceGwei).times(gasLimit);
    const txFeeUsdValue = txFeeAmt.times(ethUsdValue);
    const transactionFee = {
      amount: txFeeAmt,
      usdValue: txFeeUsdValue,
    };

    const baseLayerEthBalanceBefore = {
      amount: baseLayerEthBalance.balance,
      usdValue: baseLayerEthBalance.balance.times(ethUsdValue),
    };

    const assetToClaimUsdValue = prices.toJS().assets
      .find((a) => a.currency === assetToClaim.currency).usd;
    const claimableBN = new BigNumber(revenueFees.getIn(['claimable', 'amount']) || 0);
    const claimableAmount = claimableBN.div(new BigNumber(10).pow(assetToClaim.decimals));
    const claimable = {
      amount: claimableAmount,
      usdValue: claimableAmount.times(assetToClaimUsdValue),
    };

    const startPeriod = revenueFees.getIn(['claimable', 'startPeriod']) || 0;
    const endPeriod = revenueFees.getIn(['claimable', 'endPeriod']) || 0;

    const withdrawableBN = new BigNumber(revenueFees.getIn(['withdrawable', 'amount']) || 0);
    const withdrawableAmount = withdrawableBN.div(new BigNumber(10).pow(assetToClaim.decimals));
    const withdrawable = {
      amount: withdrawableAmount,
      usdValue: withdrawableAmount.times(assetToClaimUsdValue),
    };

    let baseLayerEthBalanceAfterAmount = baseLayerEthBalanceBefore.amount.minus(transactionFee.amount);
    if (assetToClaim.symbol === 'ETH') {
      baseLayerEthBalanceAfterAmount = baseLayerEthBalanceAfterAmount.plus(withdrawableAmount);
    }
    const baseLayerEthBalanceAfter = {
      amount: baseLayerEthBalanceAfterAmount,
      usdValue: baseLayerEthBalanceAfterAmount.times(ethUsdValue),
    };

    const walletType = currentWalletWithInfo.get('type');

    const disableClaimButton =
      claimableBN.isZero() ||
      baseLayerEthBalanceAfterAmount.isNegative() ||
      !walletReady(walletType, ledgerNanoSInfo, trezorInfo);

    const disableWithdrawButton =
      withdrawableBN.isZero() ||
      baseLayerEthBalanceAfterAmount.isNegative() ||
      !walletReady(walletType, ledgerNanoSInfo, trezorInfo);

    const TxStatus = this.generateTxStatus();

    const options = { gasLimit, gasPrice: gweiToWei(gasPriceGwei).toNumber() || null };

    return (
      <div className="review-panel">
        <Row>
          <StyledCol span={12}>
            <TooltipText details={formatMessage({ id: 'max_base_layer_fee_explain' })}>
              {formatMessage({ id: 'max_base_layer_fee' })}
            </TooltipText>
          </StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            main={<SelectableText><NumericText maxDecimalPlaces={assetToClaim.decimals} value={transactionFee.amount.toString()} /> {'ETH'}</SelectableText>}
            subtitle={<NumericText value={transactionFee.usdValue.toString()} type="fiat" />}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'base_layer' })} ETH {formatMessage({ id: 'balance_before' })}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            className="base-layer-eth-balance-before"
            main={<SelectableText><NumericText maxDecimalPlaces={assetToClaim.decimals} value={baseLayerEthBalanceBefore.amount.toString()} /> {'ETH'}</SelectableText>}
            subtitle={<NumericText value={baseLayerEthBalanceBefore.usdValue.toString()} type="fiat" />}
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
            main={<SelectableText><NumericText maxDecimalPlaces={assetToClaim.decimals} value={baseLayerEthBalanceAfter.amount.toString()} /> {'ETH'}</SelectableText>}
            subtitle={<NumericText value={baseLayerEthBalanceAfter.usdValue.toString()} type="fiat" />}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'claimable_start_period' })}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            className="claimable-start-period"
            main={<SelectableText>{startPeriod + 1}</SelectableText>}
            subtitle={''}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'claimable_end_period' })}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            className="claimable-end-period"
            main={<SelectableText>{endPeriod + 1}</SelectableText>}
            subtitle={''}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'fees_claimable_amount' })} {assetToClaim.symbol}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            className="claimable-amount"
            main={<SelectableText><NumericText maxDecimalPlaces={assetToClaim.decimals} value={claimable.amount.toString()} /> {assetToClaim.symbol}</SelectableText>}
            subtitle={<NumericText value={claimable.usdValue.toString()} type="fiat" />}
          />
        </Row>
        <Row>
          <StyledCol span={12}>{formatMessage({ id: 'fees_withdrawable_amount' })} {assetToClaim.symbol}</StyledCol>
        </Row>
        <Row>
          <TransferDescriptionItem
            className="withdrawable-amount"
            main={<SelectableText><NumericText maxDecimalPlaces={assetToClaim.decimals} value={withdrawable.amount.toString()} /> {assetToClaim.symbol}</SelectableText>}
            subtitle={<NumericText value={withdrawable.usdValue.toString()} type="fiat" />}
          />
        </Row>
        <Row>
          {
            TxStatus ?
              (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }} className="tx-status">
                  {TxStatus}
                </div>
              ) : (
                <div>
                  {
                    withdrawableBN.gt(0) ?
                      (
                        <AgreementButton
                          className="withdraw-btn"
                          onClick={() => {
                            withdrawFeesAction(currentWalletWithInfo.get('address'), assetToClaim.currency, withdrawableBN, options);
                          }}
                          disabled={disableWithdrawButton
                          }
                        >
                          {formatMessage({ id: 'withdraw_fees' })}
                        </AgreementButton>
                      ) : (
                        <AgreementButton
                          className="claim-btn"
                          onClick={() => {
                            claimFeesAction(currentWalletWithInfo.get('address'), assetToClaim.currency, startPeriod, endPeriod, options);
                          }
                          }
                          disabled={disableClaimButton}
                        >
                          {formatMessage({ id: 'claim_fees' })}
                        </AgreementButton>
                      )
                  }
                </div>
              )
          }
        </Row>
        {
          isHardwareWallet(currentWalletWithInfo.get('type')) &&
          <HWPromptWrapper>
            <HWPromptContainer />
          </HWPromptWrapper>
        }
      </div>
    );
  }

  refreshData(address, currency) {
    this.props.setSelectedWalletCurrencyAction(currency);
    this.props.loadClaimableFeesAction(address, currency);
    this.props.loadWithdrawableFeesAction(address, currency);
  }

  handleAssetChange(newSymbol) {
    const { currentWalletWithInfo, supportedAssets } = this.props;
    const assetToClaim = supportedAssets.get('assets').find((a) => a.get('symbol') === newSymbol).toJS();

    this.refreshData(currentWalletWithInfo.get('address'), assetToClaim.currency);

    this.setState({
      assetToClaim,
    });
  }

  generateTxStatus() {
    const {
      currentWalletWithInfo,
      revenueFees,
      currentNetwork,
      intl,
      ledgerNanoSInfo,
      trezorInfo,
    } = this.props;
    const { formatMessage } = intl;
    const confOnDevice = ledgerNanoSInfo.get('confTxOnDevice') || trezorInfo.get('confTxOnDevice');
    const claiming = revenueFees.get('claiming') || fromJS({});
    const withdrawing = revenueFees.get('withdrawing') || fromJS({});
    let status;
    let type;

    const activities = [claiming, withdrawing];
    for (const activity of activities) { //eslint-disable-line
      if (activity.get('status') === 'requesting') status = 'requesting';
      if (activity.get('status') === 'mining') status = 'mining';
      if (activity.get('status') === 'receipt') status = 'mining';

      if (status && activity === claiming) type = 'claiming_fees';
      if (status && activity === withdrawing) type = 'withdrawing_fees';

      if (status) break;
    }

    if (!status) return null;

    let transferingText = `${formatMessage({ id: `waiting_for_${type}_to_be` })} `;
    if (confOnDevice) {
      transferingText = `${transferingText} ${formatMessage({ id: 'signed' })}...`;
    } else if (status === 'requesting') {
      transferingText = `${transferingText} ${formatMessage({ id: 'requested' })}...`;
    } else if (status === 'mining') {
      transferingText = `${transferingText} ${formatMessage({ id: 'mined' })}...`;
    }

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
      assetToClaim,
      gasPriceGwei,
      gasLimit,
    } = this.state;
    const {
      currentWalletWithInfo,
      prices,
      gasStatistics,
      intl,
      supportedAssets,
      revenueFees,
    } = this.props;
    const { formatMessage } = intl;

    if
    (
      currentWalletWithInfo.getIn(['balances', 'nahmiiCombined', 'loading']) ||
      supportedAssets.get('loading') ||
      prices.get('loading')
    ) {
      return (
        <LoadingWrapper>
          <StyledSpin size="large" tip={formatMessage({ id: 'synchronising' })}></StyledSpin>
        </LoadingWrapper>
      );
    }

    const loadingClaimable = revenueFees.getIn(['claimable', 'loading']);
    const loadingWithdrawable = revenueFees.getIn(['withdrawable', 'loading']);
    const loadingFeesAmounts = (loadingClaimable || loadingClaimable === undefined) || (loadingWithdrawable || loadingWithdrawable === undefined);

    const assetToClaimUsdValue = prices.toJS().assets
      .find((a) => a.currency === assetToClaim.currency).usd;

    return (
      <ContentWrapper>
        <ScrollableContentWrapper style={{ flex: 1 }}>
          <div style={{ display: 'flex', flex: '1', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div style={{ flex: '1', marginRight: '2rem', marginBottom: '3rem' }}>
              <Form>
                <FormItem
                  label={<FormItemLabel>{formatMessage({ id: 'select_asset_to_claim' })}</FormItemLabel>}
                  colon={false}
                >
                  <Image
                    src={getAbsolutePath(`public/images/assets/${assetToClaim.symbol}.svg`)}
                    onError={assetImageFallback}
                    alt="logo"
                  />
                  <Select
                    defaultValue={assetToClaim.symbol}
                    onSelect={this.handleAssetChange}
                    style={{ paddingLeft: '0.5rem' }}
                  >
                    {supportedAssets.get('assets').map((asset) => (
                      <Option value={asset.get('symbol')} key={asset.get('symbol')}>
                        {asset.get('symbol')}
                      </Option>
                    ))}
                  </Select>
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
                  {`1 ${assetToClaim.symbol} = ${formatFiat(assetToClaimUsdValue, 'USD')}`}
                </DollarPrice>
              </Form>
            </div>
            <div style={{ flex: '0.5', minWidth: '34rem', marginBottom: '3rem' }}>
              {
                loadingFeesAmounts ? (
                  <LoadingWrapper className="loading-icon">
                    <StyledSpin size="large" tip={formatMessage({ id: 'synchronising' })}></StyledSpin>
                  </LoadingWrapper>
                ) : (this.getReviewPanel())
              }
            </div>
          </div>
        </ScrollableContentWrapper>
      </ContentWrapper>
    );
  }
}

NahmiiClaimFees.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  revenueFees: PropTypes.object.isRequired,
  setSelectedWalletCurrencyAction: PropTypes.func.isRequired,
  claimFeesAction: PropTypes.func.isRequired,
  withdrawFeesAction: PropTypes.func.isRequired,
  loadClaimableFeesAction: PropTypes.func.isRequired,
  loadWithdrawableFeesAction: PropTypes.func.isRequired,
  gasStatistics: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  prices: makeSelectPrices(),
  supportedAssets: makeSelectSupportedAssets(),
  currentNetwork: makeSelectCurrentNetwork(),
  revenueFees: makeSelectClaimFeesForCurrentWalletCurrency(),
  gasStatistics: makeSelectGasStatistics(),
});

function mapDispatchToProps(dispatch) {
  return {
    claimFeesAction: (...args) => dispatch(claimFeesForAccruals(...args)),
    loadClaimableFeesAction: (...args) => dispatch(loadClaimableFees(...args)),
    withdrawFeesAction: (...args) => dispatch(withdrawFees(...args)),
    loadWithdrawableFeesAction: (...args) => dispatch(loadWithdrawableFees(...args)),
    goWalletDetails: (address) => dispatch(push(`/wallet/${address}/overview`)),
    setSelectedWalletCurrencyAction: (...args) => dispatch(setSelectedWalletCurrency(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiClaimFees);
