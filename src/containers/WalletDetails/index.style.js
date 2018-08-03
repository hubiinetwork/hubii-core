import styled from 'styled-components';
import { Layout } from 'antd';
import Button from '../../components/ui/Button';
const { Header } = Layout;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const TabsLayout = styled(Layout)`
  background: ${({ theme }) => theme.palette.primary3};
  .heading {
    color: ${({ theme }) => theme.palette.light};
    font-size: 1.29rem;
    padding-top: 0.5rem;
    display: inline-flex;
  }
`;

export const StyledButton = styled(Button)`
  float: right;
  margin-top: 1.21rem;
  border-width: 0.14rem;
  padding: 0.5rem 1rem;
`;

export const WalletsTabHeader = styled(Header)`
  height: 5.29rem;
  padding: 0 2rem;
  background: ${({ theme }) => theme.palette.primary4};
`;
