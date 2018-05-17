import styled from 'styled-components';
import { Steps } from 'antd';
import Button from '../ui/Button';
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
  margin-bottom: 20px;
`;
export const StyledButton = styled(Button)`
  min-width: 160px;
`;
export const StyledBackButton = styled(Button)`
  color: white;
  border-color: white;
  margin-right: 3px;
`;
export const TextDiv = styled.div`
  display: flex;
  color: grey;
  justify-content: center;
  margin-bottom: 20px;
`;
