import styled from 'styled-components';
import { Icon } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const LeftArrow = styled(Icon)`
  font-size: 1.43rem;
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const NavigationWrapper = styled.div`
  display: flex;
  margin-right: auto;
  color: ${({ theme }) => theme.palette.light};
`;

export const SpanText = styled.span`
  font-size: 1.14rem;
  font-weight: 400;
  line-height: 1.36rem;
`;
