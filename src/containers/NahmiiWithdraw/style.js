import styled from 'styled-components';
import Button from 'components/ui/Button';
import { Col, Spin, Alert, Steps } from 'antd';

import Text from 'components/ui/Text';

const Step = Steps.Step;

export const AdvancedSettingsHeader = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
`;

export const Image = styled.img`
  width: 2.35rem;
  height: 2.35rem;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  padding-bottom: 0.29rem;
`;

export const DollarPrice = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledCol = styled(Col)`
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledButton = styled(Button)`
  margin-top: 2rem;
  width: 11.57rem;
  margin-right: 2rem;
`;

export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text {
    margin-top:1.5rem;
  }
  color: white;
`;

export const HWPromptWrapper = styled.div`
  margin-top: 2rem;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

export const NoTxPlaceholder = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-left: 1rem;
`;

export const SettlementWarning = styled(Alert)`
  margin-bottom: 3rem;
  border: none;
  background-color: transparent;
  color: #C0CDD3;
  .ant-alert-message {
    color: #C0CDD3;
  }
`;

export const ContentWrapper = styled.div`
  margin: -16px 0.5rem 0rem 2rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 10rem);
`;

export const BottomWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 50px;
  margin-right: 50px;
`;

export const ScrollableContentWrapper = styled.div`
  padding-right: 1.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const StyledSteps = styled(Steps)`
  .anticon {
    font-size: 30px;
    color: ${({ theme }) => theme.palette.info};
  }
  .ant-steps-item-title {
    font-size: 1rem;
  }
  .ant-steps-item-finish > .ant-steps-item-content > .ant-steps-item-title {
    color: ${({ theme }) => theme.palette.secondary};
  }
  .ant-steps-item-process > .ant-steps-item-content > .ant-steps-item-title {
    color: ${({ theme }) => theme.palette.secondary1};
  }
  .ant-steps-item-wait > .ant-steps-item-content > .ant-steps-item-title {
    color: ${({ theme }) => theme.palette.secondary5};
  }
  .ant-steps-item-content > .ant-steps-item-description {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.secondary};
  }
  .ant-steps-item-finish .ant-steps-item-title:after {
    background-color: ${({ theme }) => theme.palette.info2};
  }
  .ant-steps-item-process .ant-steps-item-title:after {
    background-color: ${({ theme }) => theme.palette.info1};
  }
  .ant-steps-item-wait .ant-steps-item-title:after {
    background-color: ${({ theme }) => theme.palette.info1};
  }
  .ant-steps-item-wait .anticon {
    color: ${({ theme }) => theme.palette.info1};
  }
`;
