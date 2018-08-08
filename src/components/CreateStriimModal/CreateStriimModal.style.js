import styled from 'styled-components';
import { Form, Select } from 'antd';
import Button from '../ui/Button';

export const TextLight = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.14rem;
  font-weight: 500;
  line-height: 1.36rem;
`;
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
export const IconSelect = styled(StyledSelect)`
  .ant-select-selection {
    border: 0;
    &:active,
    &:hover,
    $:focus {
      box-shadow: none;
    }
    box-shadow: none;
  }

  .ant-select-open .ant-select-selection {
    box-shadow: none;
  }
`;

export const Image = styled.img`
  width: 1.79rem;
  height: 1.79rem;
`;
export const IconSelectWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.14rem;
`;
export const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
export const Rate = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.43rem;
  font-weight: 500;
  line-height: 1.71rem;
  text-align: right;
  margin-bottom: 0.43rem;
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
