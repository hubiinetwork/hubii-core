import { Card } from 'antd';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  min-width: 370px;
  height: 113px;
  border-radius: 8px;
  text-align: left;
  padding: 0px 29px;
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
`;

const IconSpan = styled.span`
  top: 5px;
  font-size: 48px;
  position: relative;
  color: ${({ theme }) => theme.palette.info};
`;

const TitleSpan = styled.span`
  top: -7px;
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  position: relative;
  padding-left: 20px;
  color: ${({ theme }) => theme.palette.light};
`;

const Wrapper = styled.div`
  font-size: 20px;
  margin-top: 20px;
  margin-right: 15px;
  display: inline-flex;
  cursor: pointer;
`;
export { Wrapper, StyledCard, IconSpan, TitleSpan };
