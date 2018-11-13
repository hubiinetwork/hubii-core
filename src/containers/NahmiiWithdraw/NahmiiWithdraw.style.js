import styled from 'styled-components';
import { Collapse } from 'antd';
import { Alert } from 'antd';

import Button from 'components/ui/Button';
import Text from 'components/ui/Text';

export const TransferDescriptionWrapper = styled.div`
  min-width: 34rem;
  margin-bottom: 3rem;
`;

export const TransferFormWrapper = styled.div`
  display: flex;
  margin-right: 2rem;
  margin-bottom: 3rem;
  flex: 1;
`;

export const OuterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  flex-direction: column;
`;

export const StyledButton = styled(Button)`
  margin-top: 0.5rem;
`;

export const Image = styled.img`
  width: 2.35rem;
  height: 2.35rem;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  padding-bottom: 0.29rem;
`;

export const ETHtoDollar = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary};
`;

export const Panel = Collapse.Panel;

export const AdvanceSettingsHeader = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
`;

export const styledCollapse = styled(Collapse)`
  background: transparent;
  margin-left: -1.07rem;
  .ant-collapse-header {
    color: ${({ theme }) => theme.palette.info} !important;
  }
  .ant-collapse-item {
    border-bottom: none !important;
  }
  .ant-collapse-content {
    padding-right: 0rem !important;
  }
  .ant-collapse-header{
    width: fit-content;
  }
  .ant-collapse-content-box {
    padding-right: 0rem !important;
  }
`;

export const SettlementWarning = styled(Alert)`
  margin-bottom: 3rem;
`;

export const ChallengeWarning = styled(Alert)`
  margin-bottom: 3rem;
`;

export { styledCollapse as Collapse };
