import styled from 'styled-components';
import StyledButton from '../ui/Button';

const Address = styled.span`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary6};
  font-size: 0.86rem;
  font-weight: 500;
  align-items: center;
  line-height: 1rem;
  margin-top: 0.36rem;
`;

const Balance = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 1.71rem;
  margin-right: 2.14rem;
`;

const CopyButton = styled(StyledButton)`
  margin-left: 0.57rem;
  color: ${({ theme }) => theme.palette.secondary1};
  background-color: ${({ theme }) => theme.palette.primary};
  border-color: ${({ theme }) => theme.palette.primary2};
  &:hover {
    color: ${({ theme }) => theme.palette.info} !important;
    background: ${({ theme }) => theme.palette.primary2} !important;
    border-color: ${({ theme }) => theme.palette.primary2} !important;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.primary2};
    border-color: ${({ theme }) => theme.palette.primary2};
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 2.14rem;
`;

const HeaderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

const Name = styled.span`
  color: white;
  font-size: 1.29rem;
  line-height: 1.5rem;
  font-weight: 500;
`;

const WalletHeaderWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.palette.primary4};
  height: 5.29rem;
`;

const OverflowHidden = styled.div`
  overflow: hidden;
  flex: 1;
  display: flex;
`;

export {
  WalletHeaderWrapper,
  Name,
  HeaderDetail,
  DetailWrapper,
  CopyButton,
  Balance,
  Address,
  OverflowHidden,
};
