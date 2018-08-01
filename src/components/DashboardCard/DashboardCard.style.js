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
  border-radius: 8px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.palette.primary4};
  border: 1px solid ${({ theme }) => theme.palette.primary4} !important;
  &:hover {
    background-color: ${({ theme }) => theme.palette.primary5};
    border: 1px solid ${({ theme }) => theme.palette.secondary3} !important;
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
  max-height: 3rem;
  max-width: 4rem;
`;

export const Title = styled.span`
  font-family: "SF Text";
  font-weight: 500;
  margin: 0;
  padding-left: 1.5rem;
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.5rem;
`;

export const StriimTextColorBlue = styled.span`
  color: #0063A4;
`;
export const StriimTextColorPink = styled.span`
  color: #CE0284;
`;
