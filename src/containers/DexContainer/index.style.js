import styled from 'styled-components';
import { Layout } from 'antd';
const { Header } = Layout;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Title = styled.div`
  margin-top: 2rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.palette.light};
  margin-bottom: 2rem;
`;

export const TopHeader = styled(Header)`
  align-items: center;
  justify-content: space-between;
  display: flex;
  height: 5.29rem;
  padding-left: 2rem;
  padding-right: 0.2rem;
  background: ${({ theme }) => theme.palette.primary4};
`;

export const Logo = styled.img`
  margin-top: 5rem;
  width: 15rem;
`;
