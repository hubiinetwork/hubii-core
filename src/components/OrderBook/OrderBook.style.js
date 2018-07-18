
import styled from 'styled-components';
import Table from '../ui/Table';
import StriimTabs from '../ui/StriimTabs';

export const TitleLeft = styled.span`
  color: ${({ theme }) => theme.palette.secondary9} !important;
`;

export const TitleRight = styled.span`
  color: ${({ theme }) => theme.palette.secondary6} !important;
`;

export const PrimaryText = styled.span`
  color: ${({ theme }) => theme.palette.light2} !important;
`;

export const SecondaryText = styled.span`
  color: ${({ theme }) => theme.palette.info3} !important;
  font-size: 13px;
  font-weight: 500;
  line-height: 15px;
`;

export const SuccessText = styled.span`
  color: ${({ theme }) => theme.palette.success} !important;
`;

export const DangerText = styled.span`
  color: ${({ theme }) => theme.palette.danger} !important;
`;

export const Heading = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.light};
  position: absolute;
  top: 5px;
  padding-left: 8px;
`;

export const AmountWrapper = styled.div`
  background-color: ${({ theme }) => theme.palette.secondary10};
  display:flex;
  justify-content: center;
`;

export const StyledTable = styled(Table)`
  td {
    color: ${({ theme }) => theme.palette.light};
  }
  th,
  td {
    text-align: center !important;
  }
`;

export const Tabs = styled(StriimTabs)`
  .ant-tabs-nav-container {
    width: 109px;
  }
  .ant-tabs-nav .ant-tabs-tab {
    padding: 6px 5px !important;
    font-size: 17px;
    flex: 0;
  }
  .ant-tabs-bar {
    display: flex;
    justify-content: flex-end;
    padding-right: 13px;
    padding-top: 5px
  }
`;

export const Wrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.palette.primary3};
  width: 251px;
`;
