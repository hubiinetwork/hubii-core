import styled from 'styled-components';
import { Steps } from 'antd';
import Button from '../ui/Button';
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

export const SpaceBetween = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 1rem;
`;
export const StyledButton = styled(Button)`
  background-color: ${({ disabled: white }) =>
    white && `transparent !important`};
  font-size: 15px;
  font-weight: 550;
  border-width: 2px;
  border: ${({ disabled: white, theme }) =>
    white && `2px solid ${theme.palette.secondary4} !important`};
  min-width: ${({ current: width }) => (width === 0 ? `260px` : `190px`)};
  color: ${({ disabled: white, theme }) =>
    white
      ? `${theme.palette.secondary4} !important`
      : `${theme.palette.light} !important`};
  &:hover {
    background-color: ${({ disabled: white }) =>
      white && `transparent !important`};
    border: ${({ disabled: white, theme }) =>
      white && `2px solid ${theme.palette.secondary4} !important`};
  }
`;
export const StyledBackButton = styled(Button)`
  color: white;
  border-color: white;
  margin-right: 3px;
`;
export const TextDiv = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  margin-top: 32px;
  margin-bottom: 12px;
`;
export const StyledSpan = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
`;
