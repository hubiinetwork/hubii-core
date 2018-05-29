import { Col } from 'antd';
import Button from '../ui/Button';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  height: 40px;
  width: 162px;
  margin-top: 69px;
  border: 2px solid #50e3c2;
  border-radius: 4px;
`;
export const StyledButtonCancel = styled(Button)`
  height: 40px;
  width: 70px;
  min-width: 70px;
  margin-top: 69px;
  margin-right: 8px;
  border-radius: 4px;
  background: #26404d;
  color: ${({ theme }) => theme.palette.light};
  border: 1px solid ${({ theme }) => theme.palette.light};
  &:hover {
    border-radius: 4px;
    background: #26404d;
    color: ${({ theme }) => theme.palette.light};
    border: 1px solid ${({ theme }) => theme.palette.light};
  }
`;
export const StyledTitle = styled(Col)`
  color: #50e3c2;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
`;
export const StyledCol = styled(Col)`
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  margin-top: 20px;
  margin-bottom: 6px;
`;
export const StyledRecipient = styled(Col)`
  color: ${({ theme }) => theme.palette.light};
`;
export const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-start;
`;
export const BalanceCol = styled(Col)`
  height: 21px;
  width: 112px;
  color: ${({ theme }) => theme.palette.light};
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
`;
