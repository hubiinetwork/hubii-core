import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Form, FormItem, FormItemLabel } from 'components/ui/Form';
import { injectIntl } from 'react-intl';
import { getAbsolutePath } from 'utils/electron';
import Select, { Option } from 'components/ui/Select';
import Input from 'components/ui/Input';
import ethers from 'ethers';

// import {
//   makeSelectContacts,
// } from 'containers/ContactBook/selectors';
import * as nahmiiActions from 'containers/NahmiiHoc/actions';

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
  SettlementWarning,
} from './NahmiiWithdraw.style';

import * as actions from 'containers/NahmiiHoc/actions';

import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';
import {
  makeSelectReceipts,
  makeSelectLastPaymentChallenge,
  makeSelectLastSettlePaymentDriip,
} from 'containers/NahmiiHoc/selectors';

export class NahmiiWithdraw extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {amountToSendInput: 0}
    this.startPaymentChallenge = this.startPaymentChallenge.bind(this);
    this.settlePaymentDriip = this.settlePaymentDriip.bind(this);
  }

  startPaymentChallenge() {
    const {currentWalletWithInfo, allReceipts} = this.props
    const stageAmount = ethers.utils.parseEther('2.5')

    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address'))[0]
    this.props.startPaymentChallenge(lastReceipt, stageAmount)
  }

  settlePaymentDriip() {
    const {currentWalletWithInfo, allReceipts, lastPaymentChallenge} = this.props
    const challenge = lastPaymentChallenge.get('challenge')
    const lastReceipt = allReceipts.get(currentWalletWithInfo.get('address')).filter(receipt => receipt.nonce === challenge.nonce.toNumber())[0]
    this.props.settlePaymentDriip(lastReceipt)
  }

  canSettlePaymentDriip() {
    const { intl, currentWalletWithInfo, lastPaymentChallenge, lastSettlePaymentDriip } = this.props;
    const address = currentWalletWithInfo.get('address')
    const settlement = lastSettlePaymentDriip.get('settlement')
    const challenge = lastPaymentChallenge.get('challenge')
    
    if (lastPaymentChallenge.get('phase') === 'Dispute' || !lastPaymentChallenge.get('phase'))
      return false;
    
    if (lastPaymentChallenge.get('status') === 'Disqualified' || !lastPaymentChallenge.get('status'))
      return false;

    if (!settlement) {
      return (challenge && challenge.nonce.toNumber()) ? true : false
    }

    if (settlement['origin'].done && settlement['origin'].wallet === address)
      return false
    if (settlement['target'].done && settlement['target'].wallet === address)
      return false

    return true
  }

  render() {
    const { intl, lastPaymentChallenge, lastSettlePaymentDriip } = this.props;
    const { formatMessage } = intl;
    const assets = [
      {symbol: 'ETH'}
    ]

    const {
      amountToSendInput,
    } = this.state;
    
    console.log(lastPaymentChallenge.toJS())
    console.log(lastSettlePaymentDriip.toJS())
    if (lastPaymentChallenge.toJS().challenge) {
      console.log(lastPaymentChallenge.toJS().challenge.nonce.toNumber())
    }
    return (
      <OuterWrapper>
        {
          this.canSettlePaymentDriip() &&
          <SettlementWarning
            message={formatMessage({ id: 'settlement_period_ended' })}
            description={
              <div>
                <div>
                  {formatMessage({ id: 'settlement_period_ended_notice' })}
                </div>
                <StyledButton onClick={this.settlePaymentDriip}>
                  {formatMessage({ id: 'confirm_settlement' })}
                </StyledButton>
              </div>
            }
            type="info"
            showIcon
          />
        }
        <Form>
          <FormItem
            label={<FormItemLabel>{formatMessage({ id: 'select_asset' })}</FormItemLabel>}
            colon={false}
          >
            {/* <Image
              src={getAbsolutePath(`public/images/assets/${assets[0].symbol}.svg`)}
              alt="logo"
            /> */}
            <Select
              // disabled={transfering}
              defaultValue={'ETH'}
              // onSelect={this.handleAssetChange}
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
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
            colon={false}
            // help={<HelperText left={formatFiat(usdValueToSend, 'USD')} right={formatMessage({ id: 'usd' })} />}
          >
            <Input
              // disabled={transfering}
              defaultValue={amountToSendInput}
              value={amountToSendInput}
              // onFocus={() => this.onFocusNumberInput('amountToSendInput')}
              // onBlur={() => this.onBlurNumberInput('amountToSendInput')}
              // onChange={this.handleAmountToSendChange}
            />
            <StyledButton onClick={this.startPaymentChallenge} disabled={lastPaymentChallenge.get('phase') === 'Dispute'}>
              {formatMessage({id: 'settle_payment'})}
            </StyledButton>
          </FormItem>
          <FormItem
            label={<FormItemLabel>{formatMessage({ id: 'enter_amount' })}</FormItemLabel>}
            colon={false}
          >
            <Input
              defaultValue={amountToSendInput}
              value={amountToSendInput}
            />
            <StyledButton>{formatMessage({id: 'withdraw'})}</StyledButton>
          </FormItem>
        </Form>
      </OuterWrapper>
    );
  }
}

NahmiiWithdraw.propTypes = {
  // currentWalletWithInfo: PropTypes.object.isRequired,
  // currentWallet: PropTypes.object.isRequired,
  // supportedAssets: PropTypes.object.isRequired,
  // ledgerNanoSInfo: PropTypes.object.isRequired,
  // trezorInfo: PropTypes.object.isRequired,
  // transfer: PropTypes.func.isRequired,
  // history: PropTypes.object.isRequired,
  // prices: PropTypes.object.isRequired,
  // contacts: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired,
  // createContact: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  allReceipts: makeSelectReceipts(),
  lastPaymentChallenge: makeSelectLastPaymentChallenge(),
  lastSettlePaymentDriip: makeSelectLastSettlePaymentDriip(),
  // ledgerNanoSInfo: makeSelectLedgerHoc(),
  // trezorInfo: makeSelectTrezorHoc(),
  // currentWallet: makeSelectCurrentWallet(),
  // supportedAssets: makeSelectSupportedAssets(),
  // prices: makeSelectPrices(),
  // contacts: makeSelectContacts(),
  // errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    startPaymentChallenge: (...args) => dispatch(actions.startPaymentChallenge(...args)),
    settlePaymentDriip: (...args) => dispatch(actions.settlePaymentDriip(...args)),
    // createContact: (...args) => dispatch(createContact(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiWithdraw);
