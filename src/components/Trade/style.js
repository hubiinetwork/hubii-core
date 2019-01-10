import styled from 'styled-components';
import { Switch } from 'antd';

export const Wrapper = styled.div`
  background: ${({ theme }) => theme.palette.primary3};
`;

export const Header = styled.div`
  display: flex;
  padding: 0.75rem 0.75rem 0 0.75rem;
  align-items: flex-end;
`;

export const SwitchWrapper = styled.div`
  margin-left: auto;
`;

export const BuySellSwitch = styled(Switch)`
  margin: 0;
  background: ${({ theme, checked }) => checked
    ? theme.palette.danger
    : theme.palette.success
  };
`;
