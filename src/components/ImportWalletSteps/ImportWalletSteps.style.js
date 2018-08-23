import styled from 'styled-components';
import { Icon } from 'antd';
import Button from '../ui/Button';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const CreateButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
  height: 2.29rem;
  width: 10.93rem;
  &:hover {
    background-color: ${({ theme }) => theme.palette.info2};
    color: ${({ theme }) => theme.palette.light};
    border-color: ${({ theme }) => theme.palette.light};
  }
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
