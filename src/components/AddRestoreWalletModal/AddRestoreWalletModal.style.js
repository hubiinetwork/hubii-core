import styled from 'styled-components';
import { Icon } from 'antd';
import Button from '../ui/Button';

export const TitleDiv = styled.div`
  font-size: 1.14rem;
  margin-top: 4.71rem;
  text-align: center;
  color: ${({ theme }) => theme.palette.light};
  font-weight: 500;
`;

export const Container = styled.div`
  padding-bottom: 5rem;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 1rem;
  width: 8.03rem;
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1rem;
  text-align: center;
  font-family: 'SF Text';
`;

export const Arrow = styled(Icon)`
  margin-right: 0.43rem;
  display: flex;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  height: 1.36rem;
  font-weight: 500;
  line-height: 1.36rem;
  font-family: 'SF Text';
  font-size: 1.14rem;
  display: flex;
  margin-top: -0.5rem;
  color: ${({ theme }) => theme.palette.light};
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 9.29rem;
  color: ${({ theme }) => theme.palette.light};
  margin: auto;
  i {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.light1};
  font-size: 0.86rem;
  margin-top: 0.57rem;
  margin-bottom: 3.43rem;
`;

export const ButtonDiv = styled(Button)`
  margin: auto;
  display: block;
  min-width: 17.86rem;
  height: 2.86rem;
  margin-top: 1.71rem;
  margin-bottom: 1.43rem;
  border-width: 0.09rem;
  border-color: ${({ theme }) => theme.palette.light} !important;
  span {
    color: ${({ theme }) => theme.palette.light};
  }
  &:hover {
    color: ${({ theme }) => theme.palette.info};
    opacity: 0.9;
    border-color: ${({ theme }) => theme.palette.light} !important;
    background: none !important;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.info};
    opacity: 0.9;
    border-color: ${({ theme }) => theme.palette.light} !important;
    background: transparent !important;
  }
  &:active {
    color: ${({ theme }) => theme.palette.info};
    opacity: 0.9;
    border-color: ${({ theme }) => theme.palette.light} !important;
    background: transparent !important;
  }
`;

export const RightTopButton = styled(Button)`
  min-width: 9.36rem;
  border-color: ${({ theme }) => theme.palette.light};
`;

export const DisabledButton = styled(ButtonDiv)`
  cursor: not-allowed;
`;
