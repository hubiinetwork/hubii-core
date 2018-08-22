import styled from 'styled-components';
import { Layout } from 'antd';
import Button from '../../components/ui/Button';
const { Header } = Layout;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Heading = styled.h2`
  display: flex;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.29rem;
`;

export const TabsLayout = styled(Layout)`
  background: ${({ theme }) => theme.palette.primary3};
`;

export const StyledButton = styled(Button)`
  margin-left: auto;
  border-width: 0.14rem;
  padding: 0.5rem 1rem;
`;

export const WalletsTabHeader = styled(Header)`
  display: flex;
  align-items: center;
  height: 5.29rem;
  padding: 0 2rem;
  background: ${({ theme }) => theme.palette.primary4};
`;
