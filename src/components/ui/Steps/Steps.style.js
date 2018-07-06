import { Steps } from 'antd';
import styled from 'styled-components';
const Step = Steps.Step;
export const StyledStep = styled(Step)`
  flex: none;
  .ant-steps-item-content {
    display: none;
  }
  .ant-steps-item-icon {
    border: 0px solid rgba(0, 0, 0, 0.25);
    width: 76px;
    height: 3px;
    margin-right: 0px !important;
    background: ${({ theme }) => theme.palette.secondary4} !important;
  }
`;

export const StepsCentered = styled(Steps)`
  display: flex;
  justify-content: center;

  .ant-steps-item-process .ant-steps-item-icon {
    background: ${({ theme }) => theme.palette.info} !important;
  }
`;
