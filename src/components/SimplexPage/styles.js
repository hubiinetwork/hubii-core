import styled from 'styled-components';
import { Spin } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

export const StyledSpin = styled(Spin)`
  margin-top: 10rem;
  color: white;
`;
