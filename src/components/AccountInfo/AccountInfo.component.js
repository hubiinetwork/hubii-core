import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import {
  Text,
  TextPrimary,
  StyledIcon,
  Wrapper,
  StyledSelect
} from './AccountInfo.style';

const Option = Select.Option;
const AccountInfoItem = ({ accountName, amount, handleIconClick }) => (
  <Wrapper>
    <div>
      <TextPrimary className="white">{accountName}</TextPrimary>
      <Text>{`$${amount}`} </Text>
    </div>
    <StyledIcon type="qrcode" onClick={handleIconClick} />
  </Wrapper>
);

/**
 * This component give option to select different striim accounts
 */
const AccountInfo = ({ options }) => (
  <StyledSelect defaultValue={options[0].accountName} style={{ width: '100%' }}>
    {options.map(option => (
      <Option value={option.accountName}>
        <AccountInfoItem
          accountName={option.accountName}
          amount={option.amount.toLocaleString('en')}
          handleIconClick={option.handleIconClick}
        />
      </Option>
    ))}
  </StyledSelect>
);
export default AccountInfo;

AccountInfo.propTypes = {
  /**
   * Array of striim accounts
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      accountName: PropTypes.string,
      amount: PropTypes.number,
      handleIconClick: PropTypes.func
    }).isRequired
  ).isRequired
};
