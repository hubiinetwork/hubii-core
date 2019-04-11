import styled from 'styled-components';
import { Collapse, Icon } from 'antd';

import Text from 'components/ui/Text';
import NumericText from 'components/ui/NumericText';
import SelectableText from 'components/ui/SelectableText';

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

export const Amount = styled(NumericText)`
`;

export const FiatValue = styled(NumericText)`
  color: ${({ theme }) => theme.palette.secondary1};
  margin-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  ::before {
    content: '('
  }
  ::after {
    content: ')'
  }
`;

export const TransactionHistoryTime = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary1};
  white-space: nowrap;
  overflow: hidden;
  margin-right: 1rem;
`;

export const TypeText = styled(Text)`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 0.29rem;
`;

export const SubtitleText = styled(Text)`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 0.29rem;
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

export const GreenTextWrapper = styled(Text)`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
`;

export const SelectableGreenText = styled(SelectableText)`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
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
&&&& {
  color: ${({ theme }) => theme.palette.secondary};
  word-break: break-all;
  ${({ disabled, theme }) => !disabled && `
    &:active {
      color: ${theme.palette.info};
    }
    &:hover {
      color: ${theme.palette.info};
      text-decoration: underline;
    }
    &:focus {
      color: ${theme.palette.info};
    }
  `}
}`;
