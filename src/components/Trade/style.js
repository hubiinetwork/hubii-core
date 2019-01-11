import styled from 'styled-components';
import { Switch } from 'antd';
import Input from 'components/ui/Input';
import Text from 'components/ui/Text';

export const Wrapper = styled.div`
  background: ${({ theme }) => theme.palette.primary3};
  padding: 1.5rem 4.5rem;
`;

export const Header = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
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

export const StyledInput = styled(Input)`
  margin-top: 0.5rem;
  width: 12rem;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex: 1;
  justify-content: space-between;
`;

export const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

export const Label = styled(Text)`
  font-weight: 600;
`;
