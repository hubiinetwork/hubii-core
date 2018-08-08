import styled from 'styled-components';
import { Collapse, Icon } from 'antd';
const Panel = Collapse.Panel;

export const DetailPanel = styled(Panel)`
  &&& {
    padding: 0px;
    flex: 1;
    border: 0;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Amount = styled.span`
  font-size: 1rem;
  font-family: 'SF Text';
  white-space: nowrap;
  overflow: hidden;
  color: white;
`;

export const FiatValue = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.86rem;
  margin-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  font-family: 'SF Text';
`;

export const TransactionHistoryTime = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.86rem;
  white-space: nowrap;
  overflow: hidden;
  margin-left: auto;
  margin-right: 1rem;
  font-family: 'SF Text';
`;

export const TypeText = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-family: 'SF Text';
  margin-right: 0.29rem;
  font-size: 1rem;
`;

export const SubtitleText = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-family: 'SF Text';
  margin-right: 0.29rem;
  font-size: 0.93rem;
`;

export const DetailCollapse = styled(Collapse)`
  &&& {
    border-width: 0px;
    padding: 0px;
    background-color: transparent;
    flex: 1;
    display: flex;
    align-items: center;
    .ant-collapse-header {
      padding-left: 0.14rem;
      padding-right: 0.14rem;
      padding-top: 0.14rem;
      padding-bottom: 0.14rem;
    }
    .ant-collapse-content {
      padding-left: 0px;
    }
    .ant-collapse-content-box {
      padding-top: 0.57rem;
      padding: 0px;
    }
  }
`;

export const CollapsableContent = styled.div`
  margin-left: 2.73rem;
  margin-bottom: 0.25rem;
`;

export const TypeIcon = styled(Icon)`
  &&& {
    color: ${(props) => props.type === 'upload' ?
      props.theme.palette.warning :
      props.theme.palette.info};
    font-size: 1.43rem;
    display: flex;
    align-items: center;
    margin-right: 0.64rem;
  }
`;

export const GreenTextWrapper = styled.span`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
  font-family: 'SF Text';
  font-size: 0.93rem;
`;

export const Image = styled.img`
  display: flex;
  align-self: flex-start;
  align-items: center;
  height: 1.9rem;
  width: 1.9rem;
  margin-right: 0.64rem;
`;

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 0.36rem;
  align-items: center;
  border-radius: 1.43rem;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;

export const TransactionId = styled.a`
  color: ${({ theme }) => theme.palette.secondary};
  font-family: 'SF Text';
  font-size: 0.86rem;
  word-break: break-all;
  &:active {
    color: ${({ theme }) => theme.palette.info};
  }
  &:hover {
    color: ${({ theme }) => theme.palette.info};
    text-decoration: underline;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.info};
  }
`;
