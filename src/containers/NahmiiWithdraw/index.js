import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { getAbsolutePath } from 'utils/electron';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { FormItem, FormItemLabel } from 'components/ui/Form';
import Select, { Option } from 'components/ui/Select';
import * as actions from 'containers/NahmiiHoc/actions';
import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import {
  makeSelectReceipts,
  makeSelectLastPaymentChallenge,
  makeSelectLastSettlePaymentDriip,
  makeSelectNahmiiBalancesByCurrentWallet,
} from 'containers/NahmiiHoc/selectors';
import {
  makeSelectSupportedAssets,
} from 'containers/HubiiApiHoc/selectors';

import {
  OuterWrapper,
  Image,
  StyledButton,
  SettlementWarning,
  StyledForm,
  StyledFormItem,
  StyledInput,
} from './NahmiiWithdraw.style';

export class NahmiiWithdraw extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { amountToStageInput: '0', amountToWithdrawInput: '0', syncTime: new Date(), selectedSymbol: 'ETH' };
    this.state.amountInputRegex = this.getInputRegex();
    this.startPaymentChallenge = this.startPaymentChallenge.bind(this);
    this.settlePaymentDriip = this.settlePaymentDriip.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.onBlurNumberInput = this.onBlurNumberInput.bind(this);
    this.onFocusNumberInput = this.onFocusNumberInput.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
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

  getInputRegex() {
    const { selectedSymbol } = this.state;
    let assetToSendMaxDecimals;
    try {
      assetToSendMaxDecimals = this.getAssetDetailsBySymbol(selectedSymbol).get('decimals');
    } catch (error) {
      assetToSendMaxDecimals = 18;
    }
    const amountInputRegex = new RegExp(`^\\d+(\\.\\d{0,${assetToSendMaxDecimals}})?$`);
    return amountInputRegex;
  }

  getAssetDetailsBySymbol(symbol) {
    const { supportedAssets } = this.props;
    const assetDetails = supportedAssets.get('assets').find((a) => a.get('symbol') === symbol);
    return assetDetails;
  }

  getAssetDetailsByCurrencyAddress(currency) {
    const { supportedAssets } = this.props;
    const address = currency === '0x0000000000000000000000000000000000000000' ? 'ETH' : currency;
    const assetDetails = supportedAssets.get('assets').find((a) => a.get('currency') === address);
    return assetDetails;
  }

  getLastReceipt() {
    const { allReceipts, currentWalletWithInfo } = this.props;
    const { selectedSymbol } = this.state;
    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol);
    const walletReceipts = allReceipts.get(currentWalletWithInfo.get('address'));
    if (!assetDetails) {
      return null;
    }

    if (!walletReceipts) {
      return null;
    }

    const currency = assetDetails.toJS().symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetDetails.toJS().symbol;
    const lastReceipt = walletReceipts.filter((r) => r.currency.ct === currency).sort((a, b) => b.nonce - a.nonce)[0];
    return lastReceipt;
  }

  getReceiptByNonce(nonce) {
    const { allReceipts, currentWalletWithInfo } = this.props;
    const receipt = allReceipts.get(currentWalletWithInfo.get('address')).find((r) => r.nonce === nonce);
    return receipt;
  }

  settlePaymentDriip() {
    const { currentWalletWithInfo, allReceipts, lastPaymentChallenge } = this.props;
    const challenge = lastPaymentChallenge.get('challenge');
    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address')).filter((receipt) => receipt.nonce === challenge.nonce.toNumber())[0];
    this.props.settlePaymentDriip(lastReceipt);
    this.state.syncTime = moment().add(30, 'seconds').toDate();
  }

  startPaymentChallenge() {
    const { selectedSymbol, amountToStage } = this.state;
    const lastReceipt = this.getLastReceipt();

    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol).toJS();
    this.props.startPaymentChallenge(lastReceipt, amountToStage || new BigNumber(0), assetDetails.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetDetails.currency);
    this.state.syncTime = moment().add(30, 'seconds').toDate();
  }

  withdraw() {
    const { selectedSymbol, amountToWithdraw } = this.state;
    const assetDetails = this.getAssetDetailsBySymbol(selectedSymbol).toJS();
    const currency = assetDetails.symbol === 'ETH' ? '0x0000000000000000000000000000000000000000' : assetDetails.currency;
    this.props.withdraw(amountToWithdraw, currency);
  }

  isChallengeInProgress() {
    const { lastPaymentChallenge } = this.props;
    const challenge = lastPaymentChallenge.get('challenge');
    if (challenge && challenge.timeout.toNumber() * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }

  canSettlePaymentDriip() {
    const { currentWalletWithInfo, lastPaymentChallenge, lastSettlePaymentDriip } = this.props;
    const { syncTime } = this.state;
    const address = currentWalletWithInfo.get('address');
    const settlement = lastSettlePaymentDriip.get('settlement');
    const challenge = lastPaymentChallenge.get('challenge');
    const challengeUpdatedTime = lastPaymentChallenge.get('updatedAt');
    const settlementUpdatedTime = lastSettlePaymentDriip.get('updatedAt');

    if (!challengeUpdatedTime || !settlementUpdatedTime) {
      return false;
    }

    if (syncTime.getTime() > challengeUpdatedTime.getTime() || syncTime.getTime() > settlementUpdatedTime.getTime()) {
      return false;
    }

    if (lastPaymentChallenge.get('phase') === 'Dispute' || !lastPaymentChallenge.get('phase')) { return false; }

    if (lastPaymentChallenge.get('status') === 'Disqualified' || !lastPaymentChallenge.get('status')) { return false; }

    if (!settlement) {
      return false;
    }

    if (!challenge || !challenge.nonce.toNumber()) {
      return false;
    }

    if (!settlement.origin || !settlement.target) {
      return true;
    }

    if (settlement.origin.done && settlement.origin.wallet === address) { return false; }
    if (settlement.target.done && settlement.target.wallet === address) { return false; }

    return true;
  }

  canWithdraw() {
    const { selectedSymbol, amountToWithdraw } = this.state;
    const { nahmiiBalances } = this.props;
    const { staged } = nahmiiBalances.toJS();
    if (!staged || !amountToWithdraw) {
      return false;
    }
    const stagedBalance = staged.assets.find((a) => a.symbol === selectedSymbol).balance || new BigNumber('0');
    return stagedBalance.gte(amountToWithdraw) && amountToWithdraw.gt(new BigNumber('0'));
  }

  handleAssetChange(symbol) {
    const { supportedAssets } = this.props;
    const assetDetails = supportedAssets.get('assets').find((a) => a.get('symbol') === symbol).toJS();
    const amountInputRegex = this.getInputRegex();
    this.setState({ selectedSymbol: assetDetails.symbol, amountInputRegex });
  }

  canStartPaymentChallenge() {
    const { lastPaymentChallenge, lastSettlePaymentDriip } = this.props;
    const { syncTime, amountToStage } = this.state;
    const challengeUpdatedTime = lastPaymentChallenge.get('updatedAt');
    // const challenge = lastPaymentChallenge.get('challenge');
    const settlementUpdatedTime = lastSettlePaymentDriip.get('updatedAt');
    const lastReceipt = this.getLastReceipt();

    if (!lastReceipt) {
      return false;
    }

    if (!amountToStage || amountToStage.eq(new BigNumber(0))) {
      return false;
    }

    return lastPaymentChallenge.get('phase') !== 'Dispute' &&
           lastPaymentChallenge.get('txStatus') !== 'mining' &&
           !this.canSettlePaymentDriip() &&
           this.hasValidReceiptForNewChallenge() &&
           (settlementUpdatedTime && challengeUpdatedTime && syncTime.getTime() < settlementUpdatedTime.getTime() && syncTime.getTime() < challengeUpdatedTime.getTime());
  }

  hasValidReceiptForNewChallenge() {
    const { lastPaymentChallenge } = this.props;
    const challenge = lastPaymentChallenge.get('challenge');
    const lastReceipt = this.getLastReceipt()
    if (lastReceipt && challenge && challenge.nonce.toNumber() < lastReceipt.nonce) {
      return true
    }
    return false
  }

  handleAmountChange(e, inputProp) {
    const { value } = e.target;
    const { amountInputRegex, selectedSymbol } = this.state;

    // allow an empty input to represent 0
    if (value === '') {
      this.setState({ [`${inputProp}Input`]: '', [inputProp]: new BigNumber('0') });
    }

    // don't update if invalid regex (numbers followed by at most 1 . followed by max possible decimals)
    if (!amountInputRegex.test(value)) return;

    // don't update if is an infeasible amount of Ether (> 100x entire circulating supply as of Aug 2018)
    if (!isNaN(value) && Number(value) > 10000000000) return;

    // update amount to send if it's a real number
    if (!isNaN(value)) {
      const maxDecimals = this.getAssetDetailsBySymbol(selectedSymbol).get('decimals');
      this.setState({ [inputProp]: (new BigNumber(value)).times(new BigNumber('10').pow(maxDecimals)) });
    }

    // update the input (this could be an invalid number, such as '12.')
    this.setState({ [`${inputProp}Input`]: value });
  }

  render() {
    const { intl, lastPaymentChallenge, nahmiiBalances, supportedAssets } = this.props;
    const { formatMessage } = intl;
    const {
      selectedSymbol,
      amountToStageInput,
      amountToWithdrawInput,
    } = this.state;

    const { staged } = nahmiiBalances.toJS();
    const challenge = lastPaymentChallenge.get('challenge');
    const selectedAssetDetails = this.getAssetDetailsBySymbol(selectedSymbol);
    if (!selectedAssetDetails || !staged || !challenge) {
      return (null);
    }

    let challengeAssetSymbol;
    const challengeReceipt = this.getReceiptByNonce(challenge.nonce.toNumber());
    if (challengeReceipt) {
      const challengeAsssetDetails = this.getAssetDetailsByCurrencyAddress(challengeReceipt.currency.ct);
      challengeAssetSymbol = challengeAsssetDetails ? challengeAsssetDetails.toJS().symbol : null;
    }

    const assets = supportedAssets.get('assets').toJS();
    const assetDecimals = selectedAssetDetails.toJS().decimals;
    const stagedBalance = staged.assets.find((a) => a.symbol === selectedSymbol) || { balance: new BigNumber('0') };
    const formattedStagedBalance = stagedBalance.balance.div(new BigNumber('10').pow(assetDecimals)).toString();
    return (
      <OuterWrapper>
        {
          this.canSettlePaymentDriip() &&
          <SettlementWarning
            message={formatMessage({ id: 'settlement_period_ended' })}
            description={
              <div>
                <div>
                  {formatMessage({ id: 'settlement_period_ended_notice' }, { symbol: challengeAssetSymbol })}
                </div>
                <StyledButton onClick={this.settlePaymentDriip} disabled={!this.canSettlePaymentDriip()}>
                  {formatMessage({ id: 'confirm_settlement' })}
                </StyledButton>
              </div>
            }
            type="warning"
            showIcon
          />
        }
        {
          this.isChallengeInProgress() &&
          <SettlementWarning
            message={formatMessage({ id: 'challenge_period_progress' })}
            description={formatMessage({ id: 'challenge_period_endtime' }, { endtime: moment(challenge.timeout * 1000).format('LLLL'), symbol: challengeAssetSymbol })}
            type="warning"
            showIcon
          />
        }
        {
          !this.hasValidReceiptForNewChallenge() &&
          <SettlementWarning
            message={formatMessage({ id: 'no_valid_receipt_for_new_challenge' })}
            description={formatMessage({ id: 'need_valid_receipt_for_new_challenge' })}
            type="warning"
            showIcon
          />
        }
        <StyledForm>
          <FormItem
            label={<FormItemLabel>{formatMessage({ id: 'select_asset' })}</FormItemLabel>}
            colon={false}
          >
            <Image
              src={getAbsolutePath(`public/images/assets/${selectedSymbol}.svg`)}
              alt="logo"
            />
            <Select
              defaultValue={'ETH'}
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
          <StyledFormItem
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount_stage' })}</FormItemLabel>}
            colon={false}
            // help={<HelperText left={formatFiat(usdValueToSend, 'USD')} right={formatMessage({ id: 'usd' })} />}
          >
            <StyledInput
              defaultValue={amountToStageInput}
              value={amountToStageInput}
              onFocus={() => this.onFocusNumberInput('amountToStageInput')}
              onBlur={() => this.onBlurNumberInput('amountToStageInput')}
              onChange={(e) => this.handleAmountChange(e, 'amountToStage')}
            />
            <StyledButton onClick={this.startPaymentChallenge} disabled={!this.canStartPaymentChallenge()}>
              {formatMessage({ id: 'settle_payment' })}
            </StyledButton>
          </StyledFormItem>
          <StyledFormItem
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount_withdraw' }, { withdraw_amount: formattedStagedBalance, symbol: 'ETH' })}</FormItemLabel>}
            colon={false}
          >
            <StyledInput
              defaultValue={amountToWithdrawInput}
              value={amountToWithdrawInput}
              onFocus={() => this.onFocusNumberInput('amountToWithdrawInput')}
              onBlur={() => this.onBlurNumberInput('amountToWithdrawInput')}
              onChange={(e) => this.handleAmountChange(e, 'amountToWithdraw')}
            />
            <StyledButton onClick={this.withdraw} disabled={!this.canWithdraw()}>{formatMessage({ id: 'withdraw' })}</StyledButton>
          </StyledFormItem>
        </StyledForm>
      </OuterWrapper>
    );
  }
}

NahmiiWithdraw.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  allReceipts: PropTypes.object.isRequired,
  lastPaymentChallenge: PropTypes.object.isRequired,
  lastSettlePaymentDriip: PropTypes.object.isRequired,
  nahmiiBalances: PropTypes.object.isRequired,
  settlePaymentDriip: PropTypes.func.isRequired,
  startPaymentChallenge: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  allReceipts: makeSelectReceipts(),
  lastPaymentChallenge: makeSelectLastPaymentChallenge(),
  lastSettlePaymentDriip: makeSelectLastSettlePaymentDriip(),
  nahmiiBalances: makeSelectNahmiiBalancesByCurrentWallet(),
  supportedAssets: makeSelectSupportedAssets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    startPaymentChallenge: (...args) => dispatch(actions.startPaymentChallenge(...args)),
    settlePaymentDriip: (...args) => dispatch(actions.settlePaymentDriip(...args)),
    withdraw: (...args) => dispatch(actions.withdraw(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiWithdraw);
