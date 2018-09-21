/**
*
* SelectWallet
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Select, { Option } from 'components/ui/Select';

const StyledSelect = styled(Select)`
&&&& {
  padding: 1rem;
  width: 33rem;
  border: 2px solid ${({ theme }) => theme.palette.secondary7};
  border-radius: 0.5rem;
  .ant-select-selection {
    height: auto;
  }
}`;

const WalletName = styled.p`
  font-size: 1.3rem;
  margin-bottom: 0.2rem;
`;


function SelectWallet(props) {
  return (
    <div>
      <StyledSelect
        {...props}
      >
        {
          props.wallets.map((w) => (
            <Option key={w.address} value={w.address}>
              <div>
                <WalletName>{w.name}</WalletName>
                <p>{w.address}</p>
              </div>
            </Option>
          ))
        }
      </StyledSelect>
    </div>
  );
}

SelectWallet.propTypes = {
  wallets: PropTypes.array.isRequired,
};

export default SelectWallet;
