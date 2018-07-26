import styled from 'styled-components';
import { Layout, Switch } from 'antd';
import Toggler from 'components/Toggler';
import Button from '../../components/ui/Button';
const { Header } = Layout;
export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Heading = styled.h2`

  display: flex;
  font-family: "SF Text";
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.palette.light};
  font-size: 18px;
`;

export const StyledToggler = styled(Toggler)`
  margin-top: 5rem;
`;

export const TabsLayout = styled(Layout)`

  background: ${({ theme }) => theme.palette.primary3};
`;

export const StyledButton = styled(Button)`
  margin-left: auto;
  border-width: 2px;
  padding: 0.5rem 1rem;
`;

export const StyledSwitch = styled(Switch)`
  border-width: 2px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 43px;
`;

export const WalletsTabHeader = styled(Header)`
  align-items: center;
  display: flex;
  height: 74px;
  padding: 0 28px;
  background: ${({ theme }) => theme.palette.primary4};
`;
