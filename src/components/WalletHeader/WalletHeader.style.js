import styled from 'styled-components';
import StyledButton from '../ui/Button';

const Address = styled.span`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 12px;
  align-items: center;
`;

const Balance = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 24px;
  margin-right: 30px;
`;

const CopyButton = styled(StyledButton)`
  margin-left: 8px;
  color: ${({ theme }) => theme.palette.secondary1};
  background: ${({ theme }) => theme.palette.primary2};
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
  margin-left: 50px;
`;

const HeaderDetail = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

const Name = styled.span`
  color: white;
  font-size: 18px;
  font-weight: 400;
`;

const WalletHeaderWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.palette.primary4};
  height: 72px;
`;

export {
  WalletHeaderWrapper,
  Name,
  HeaderDetail,
  DetailWrapper,
  CopyButton,
  Balance,
  Address
};
