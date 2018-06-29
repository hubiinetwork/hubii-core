import styled from 'styled-components';
import { Layout } from 'antd';
import Button from '../../components/ui/Button';
const { Header } = Layout;

export const Wrapper = styled.div`
  width: 100%;
  padding-left: 2rem;
  padding-top: 1rem;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const TabsLayout = styled(Layout)`
  background: ${({ theme }) => theme.palette.primary3};
  .heading {
    color: ${({ theme }) => theme.palette.light};
    font-size: 18px;
    padding-top: 7px;
    display: inline-flex;
  }
`;

export const StyledButton = styled(Button)`
  float: right;
  margin-top: 17px;
  border-width: 2px;
  padding: 0.5rem 1rem;
`;

export const WalletsTabHeader = styled(Header)`
  height: 74px;
  padding: 0 28px;
  background: ${({ theme }) => theme.palette.primary4};
`;
