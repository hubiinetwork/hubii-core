import styled from 'styled-components';
import { Layout } from 'antd';
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

export const Title = styled.div`
  margin-top: 2rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.palette.light};
  margin-bottom: 2rem;
`;

export const TopHeader = styled(Header)`
  align-items: center;
  display: flex;
  height: 4.625rem;
  padding: 0 1.75rem;
  background: ${({ theme }) => theme.palette.primary4};
`;

