import { Card, Icon } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled(Card)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 23rem;
  height: 9rem;
  border-radius: 0.57rem;
  box-shadow: 0 0.14rem 0.36rem 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.palette.primary4};
  border: 0.07rem solid ${({ theme }) => theme.palette.primary4} !important;
  &:hover {
    background-color: ${({ theme }) => theme.palette.primary5};
    border: 0.07rem solid ${({ theme }) => theme.palette.secondary3} !important;
  }
  &:focus {
    text-decoration: none;
  }
  .ant-card-body {
    display: flex;
    flex-direction: center;
    align-items: center;
  }
`;

export const AntdIcon = styled(Icon)`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.palette.info};
`;

export const CustomIcon = styled.img` 
  max-width: 4rem;
  max-height: ${(props) => props.src.includes('nahmii') ? '3.5' : '3'}rem;
`;

export const Title = styled.span`
  font-weight: 400;
  margin: 0;
  padding-left: 1.5rem;
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.5rem;
`;
