import styled from 'styled-components';
import { Icon } from 'antd';
import Button from '../ui/Button';

export const Between = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const CreateButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
  height: 32px;
  width: 153px;
  &:hover {
    background-color: ${({ theme }) => theme.palette.info2};
    color: ${({ theme }) => theme.palette.light};
    border-color: ${({ theme }) => theme.palette.light};
  }
`;
export const LeftArrow = styled(Icon)`
  font-size: 20px;
  margin-right: 7px;
  cursor: pointer;
`;
export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;
export const SpanText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
`;
