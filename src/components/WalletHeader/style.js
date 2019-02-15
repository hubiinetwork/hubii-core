import styled from 'styled-components';
import Button from 'components/ui/Button';
import Text from 'components/ui/Text';
import Heading from 'components/ui/Heading';

const Address = styled(Text)`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary6};
  align-items: center;
  margin-top: 0.36rem;
`;

const Balance = styled(Heading)`
  color: ${({ theme }) => theme.palette.info};
`;

const CopyButton = styled(Button)`
  margin-left: 0.57rem;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin: 1rem 2rem;
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
  HeaderDetail,
  DetailWrapper,
  CopyButton,
  Balance,
  Address,
  OverflowHidden,
};
