import styled from 'styled-components';
import Button from '../ui/Button';
import { Icon } from 'antd';

export const Between = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
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

export const Image = styled.img`
  width: 150px;
  height: 50px;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const WidthEighty = styled.div`
  width: 80%;
`;

export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;
export const IconDiv = styled.div`
  display: flex;
  justify-content: center;
`;
