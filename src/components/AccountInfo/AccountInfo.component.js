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
      <StyledIcon type="qrcode" className="hide" />
    </div>
  </Wrapper>
);

/**
 * This component give option to select different striim accounts
 */
class AccountInfo extends React.Component {
  state = {
    activeSelect: 0
  };
  onChange = value => {
    const activeSelect = this.props.options.findIndex(
      (option, i) => `${option.accountName}-${i}` === value
    );
    this.setState({ activeSelect });
  };
  render() {
    const { options } = this.props;
    const { activeSelect } = this.state;

    return (
      <div style={{ position: 'relative' }}>
        <StyledIcon
          type="qrcode"
          onClick={options[activeSelect].handleIconClick}
        />
        <StyledSelect
          defaultValue={`${options[0].accountName}-${0}`}
          style={{ width: '100%' }}
          onChange={this.onChange}
        >
          {options.map((option, i) => (
            <Option
              value={`${option.accountName}-${i}`}
              key={`${option.accountName}-${i}`}
            >
              <AccountInfoItem
                accountName={option.accountName}
                amount={option.amount.toLocaleString('en')}
                handleIconClick={option.handleIconClick}
              />
            </Option>
          ))}
        </StyledSelect>
      </div>
    );
  }
}
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
