import styled from 'styled-components';
import Button from 'components/ui/Button';

const Address = styled.span`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary6};
  font-size: 0.86rem;
  font-weight: 400;
  align-items: center;
  line-height: 1rem;
  margin-top: 0.36rem;
`;

const Balance = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 1.71rem;
  margin-right: 2.14rem;
`;

const CopyButton = styled(Button)`
  margin-left: 0.57rem;
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
  font-weight: 400;
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
