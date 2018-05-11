import { Col } from 'antd';
import Button from '../ui/Button';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  min-width: 150px;
  border-width: 2px;
  padding: 0.5rem 1rem;
  margin: 1rem;
`;
export const StyledCancelButton = styled(Button)`
  border-width: 2px;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
`;
export const StyledTitle = styled(Col)`
  color: ${({ theme }) => theme.palette.info};
  font-size: 12px;
`;
export const StyledCol = styled(Col)`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.secondary};
`;
export const StyledRecipient = styled(Col)`
  color: ${({ theme }) => theme.palette.light};
`;
export const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;
export const BalanceCol = styled(Col)`
  color: ${({ theme }) => theme.palette.info};
  font-size: 18px;
`;
