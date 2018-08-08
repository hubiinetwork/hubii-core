import styled from 'styled-components';
import { Layout, Switch, Select } from 'antd';
import Toggler from 'components/Toggler';
import Button from '../../components/ui/Button';
const { Header } = Layout;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const Heading = styled.h2`
  display: flex;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.125rem;
  margin: 0;
`;

export const StyledToggler = styled(Toggler)`
  margin-top: 5rem;
`;

export const StyledButton = styled(Button)`
  width: 23.57rem;
  margin-top: 1.5rem;
  border-width: 0.125rem;
  padding: 0.5rem 1rem;
`;

export const StyledHeader = styled.div`
  height: 0.875rem;
  color: ${({ theme }) => theme.palette.light};
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const RedButton = styled(Button)`
  width: 23.57rem;
  margin-top: 1.5rem;
  border-width: 0rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.palette.alert};
  color: ${({ theme }) => theme.palette.light};
`;

export const SubtitleText = styled.div`
  margin-top: 0.7rem;
  height: 0.875rem;
  width: 19.125rem;
  color: ${({ theme }) => theme.palette.secondary6};
  font-size: 0.75rem;
  font-style: italic;
  line-height: 0.875rem;
  text-align: center;
`;

export const StyledSelect = styled(Select)`
  .ant-select-selection--single {
    background-color: transparent;
    color: ${({ theme }) => theme.palette.light};
  }
  width: 23.57rem;
`;

export const StyledSwitch = styled(Switch)`
  border-width: 0.125rem;
  margin-left: auto;
  margin-right: 0.5rem;
  width: 1rem;
  min-width: 2.9rem;
  background-color: ${({ theme }) => theme.palette.secondary2};
  &.ant-switch:after, &.ant-switch-checked:after {
    background-color: ${({ theme }) => theme.palette.info3};
  }
`;

export const TopHeader = styled(Header)`
  align-items: center;
  display: flex;
  height: 4.625rem;
  padding: 0 1.75rem;
  background: ${({ theme }) => theme.palette.primary4};
`;

export const Segment = styled.div`
  margin-top: 2rem;
`;
