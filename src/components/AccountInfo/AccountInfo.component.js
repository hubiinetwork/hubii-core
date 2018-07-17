import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import {
  Text,
  TextPrimary,
  StyledIcon,
  Wrapper,
  StyledSelect,
} from './AccountInfo.style';

const Option = Select.Option;
const AccountInfoItem = ({ accountName, amount }) => (
  <Wrapper>
    <div>
      <TextPrimary className="white">{accountName}</TextPrimary>
      <Text>{`$${amount.toLocaleString('en', { currency: 'USD' })}`} </Text>
    </div>
  </Wrapper>
);
AccountInfoItem.propTypes = {
  accountName: PropTypes.string,
  amount: PropTypes.number,
};

/**
 * This component give option to select different striim accounts
 */
class AccountInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSelect: 0,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const activeSelect = this.props.options.findIndex(
      (option) => `${option.accountName}` === value
    );
    this.props.onSelectChange(activeSelect);
    this.setState({ activeSelect });
  }
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
          defaultValue={`${options[0].accountName}`}
          style={{ width: '100%' }}
          onChange={this.onChange}
        >
          {options.map((option) => (
            <Option
              value={`${option.accountName}`}
              key={`${option.accountName}`}
            >
              <AccountInfoItem
                accountName={option.accountName}
                amount={option.amount}
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
      handleIconClick: PropTypes.func,
    }).isRequired
  ).isRequired,
  /**
   * Function executed when dropdown selected item is changed.
   */
  onSelectChange: PropTypes.func.isRequired,
};
