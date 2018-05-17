import styled from 'styled-components';
import { Steps, Button, message } from 'antd';
const Step = Steps.Step;

export const StyledStep = styled(Step)`
  .ant-steps-item-content {
    display: none;
  }
  .ant-steps-item-icon {
    border: 1px solid rgba(0, 0, 0, 0.25);
    width: 32px;
    height: 3px;
    line-height: 32px;
    text-align: center;
    margin-right: 8px;
  }
`;
export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;
