import styled from 'styled-components';
import { Layout, Switch, Select } from 'antd';
import Toggler from 'components/Toggler';
import Button from '../../components/ui/Button';
const { Header } = Layout;
export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Heading = styled.h2`
  display: flex;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.light};
  font-size: 18px;
  margin: 0;
`;

export const StyledToggler = styled(Toggler)`
  margin-top: 5rem;
`;

export const TabsLayout = styled(Layout)`
  background: ${({ theme }) => theme.palette.primary3};
`;

export const StyledButton = styled(Button)`
  width: 330px;
  margin-top: 1.5rem;
  border-width: 2px;
  padding: 0.5rem 1rem;
`;

export const StyledHeader = styled.div`
  height: 14px;
  color: ${({ theme }) => theme.palette.light};
  font-size: 12px;
  font-weight: 300;
  line-height: 14px;
  margin-bottom: 0.5rem;
`;

export const RedButton = styled(Button)`
  width: 330px;
  margin-top: 1.5rem;
  border-width: 0px;
  padding: 0.5rem 1rem;
  background-color: #FF5A5A;
  
  color: ${({ theme }) => theme.palette.light};
`;

export const SubtitleText = styled.div`
  margin-top: 0.7rem;
  height: 14px;
  width: 306px;
  color: #8CA5B1;
  font-size: 12px;
  font-style: italic;
  line-height: 14px;
  text-align: center;
`;

export const StyledSelect = styled(Select)`
  .ant-select-selection--single {
    background-color: transparent;
    color: ${({ theme }) => theme.palette.light};
  }
  /* border: 1px solid #43616F; */
`;

export const StyledSwitch = styled(Switch)`
  border-width: 2px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 1rem;
  min-width: 2.9rem;
  background-color: ${({ theme }) => theme.palette.secondary2};
  &.ant-switch:after, &.ant-switch-checked:after {
    background-color: ${({ theme }) => theme.palette.info3};
  }
`;

export const WalletsTabHeader = styled(Header)`
  align-items: center;
  display: flex;
  height: 74px;
  padding: 0 28px;
  background: ${({ theme }) => theme.palette.primary4};
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 14px;
  width: 112.39px;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  font-family: 'SF Text';
`;
