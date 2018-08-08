import styled from 'styled-components';
import { Form, Select } from 'antd';
import Button from '../ui/Button';

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

export const StyledSelect = styled(Select)`
  .ant-select-selection {
    background-color: ${({ theme }) => theme.palette.primary1};
    border-color: ${({ theme }) => theme.palette.secondary4};
  }
  &&&.ant-select {
    color:${({ theme }) => theme.palette.light};
  }
  .ant-select-arrow {
    color: ${({ theme }) => theme.palette.light};
  }
  &.ant-select-dropdown-menu-item {
    background-color: ${({ theme }) => theme.palette.primary1};
  }
  .ant-select-selection-selected-value {
    color: ${({ theme }) => theme.palette.light};
  }
`;

export const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 6.64rem;
  min-width: 17.14rem;
  margin-bottom: 4.29rem;
  border: 0.14rem solid ${({ theme }) => theme.palette.info3};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledForm = styled(Form)`
  width: 67%;
  margin: 0 auto;
`;
