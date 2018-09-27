import styled from 'styled-components';
import { Icon } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const LeftArrow = styled(Icon)`
  font-size: 1.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: auto;
`;
