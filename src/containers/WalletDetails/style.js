import styled from 'styled-components';
import { Layout } from 'antd';

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const HeaderWrapper = styled(Layout)`
  background: ${({ theme }) => theme.palette.primary3};
  .heading {
    color: ${({ theme }) => theme.palette.light};
    font-size: 1.29rem;
    padding-top: 0.5rem;
    display: inline-flex;
  }
`;
