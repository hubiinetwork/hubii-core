import React from 'react';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import {
  PaymentHistoryItemCard,
  Wrapper,
  Image,
} from './PaymentHistoryItem.style';
import PaymentHistoryDetail from '../PaymentHistoryDetail';
/**
 * This component shows history of a past payment's detail.
 */
export const PaymentHistoryItem = (props) => (
  <Wrapper>
    <PaymentHistoryItemCard>
      <Image src={getAbsolutePath(`public/asset_images/${props.data.coin}.svg`)} />
      <PaymentHistoryDetail data={props.data} />
    </PaymentHistoryItemCard>
  </Wrapper>
  );
PaymentHistoryItem.propTypes = {
  /**
   * prop  of data of PaymentHistoryItem.
   */
  data: PropTypes.shape({
    coin: PropTypes.string,
    coinAmount: PropTypes.number,
    USDAmount: PropTypes.number,
    to: PropTypes.string,
    type: PropTypes.oneOf([
      'Order',
      'Payment',
      'Withdrawal',
      'Deposit',
      'Trade',
    ]),
    toID: PropTypes.string,
    hashID: PropTypes.string,
    timeStamp: PropTypes.object,
    blockHeight: PropTypes.number,
    gasLimit: PropTypes.number,
    gasTxn: PropTypes.number,
    gasPrice: PropTypes.number,
    cost: PropTypes.number,
    exchangeRate: PropTypes.number,
  }).isRequired,
};
