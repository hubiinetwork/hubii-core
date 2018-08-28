import styled from 'styled-components';
import { Icon } from 'antd';
import Button from '../../ui/Button';

export const InfoContent = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.93rem;
`;

export const Info = styled(Icon)`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 1.43rem;
  display: flex;
  align-items: center;
  &:hover {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const RoundButton = styled(Button)`
  color: ${({ theme }) => theme.palette.secondary1};
  background: ${({ theme }) => theme.palette.primary4};
  border-color: ${({ theme }) => theme.palette.primary4};
  &:hover {
    color: ${({ theme }) => theme.palette.info} !important;
    background: ${({ theme }) => theme.palette.primary4} !important;
    border-color: ${({ theme }) => theme.palette.primary4} !important;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.primary4};
    border-color: ${({ theme }) => theme.palette.primary4};
  }
`;

export const RestoreButton = styled(Button)`
  min-width: 17.14rem;
  border-width: 0.14rem;
  margin-top: 3.5rem;
`;

export const IconWrapper = styled.div`
  display: flex;
  margin-top: -0.5rem;
`;

export const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.71rem;
  margin-bottom: 0.86rem;
`;

export const Loading = styled(Icon)`
  font-size: 5.36rem;
  color: ${({ theme }) => theme.palette.info};
  margin-top: 1rem;
`;
