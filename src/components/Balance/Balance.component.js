import React from 'react';
import PropTypes from 'prop-types';
import {
  FlexWrapper,
  ImageWrapper,
  Image,
  DetailWrapper,
  AlignCenter,
  BalanceColor,
  Caret,
} from './Balance.style';

const Balance = (props) => (
  <FlexWrapper>
    {props.coin && (
    <ImageWrapper>
      <Image
      // eslint-disable-next-line global-require
        src={require(`../../../public/asset_images/${props.coin}.svg`)}
      />
      {props.caret && <Caret />}
    </ImageWrapper>
      )}
    <DetailWrapper>
      <div>{props.title || 'Balance'}</div>
      <AlignCenter>
        <BalanceColor info={props.info}>
          {props.showDollar && '$'}
          {props.balance}
        </BalanceColor>{' '}
        {props.showCoinName}
      </AlignCenter>
    </DetailWrapper>
  </FlexWrapper>
  );

Balance.propTypes = {
  /**
   * Name of the coin.
   */
  coin: PropTypes.string,
  /**
   * Title of the Balance (Usually  Balance).
   */
  title: PropTypes.string,
  /**
   * Amount of balance.
   */
  balance: PropTypes.string.isRequired,
  /**
   * If  provided, name of the coin is shown.
   */
  showCoinName: PropTypes.string,
  /**
   * If  true, amount  is shown  in info  color.
   */
  info: PropTypes.bool,
  /**
   * If  true, dollar is shown with amount.
   */
  showDollar: PropTypes.bool,
  /**
   * If  true, caret is shown with icon.
   */
  caret: PropTypes.bool,
};

export default Balance;
