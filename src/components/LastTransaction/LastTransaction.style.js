import { Row } from 'antd';
import styled from 'styled-components';
import Button from '../ui/Button';

export const Image = styled.img`
  height: 24px;
  width: 24px;
  display: inline-block;
  margin-right: 9px;
`;
export const TransactionInfo = styled.div`
  width: 294px;
  height: 214px;
  margin-bottom: 67px;
`;
export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info};
  margin-right: 3px;
  font-family: 'SF Text';
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  margin-bottom: 6px;
`;
export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 1.5rem;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  margin-bottom: 6px;
`;
export const TextSecondary = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-weight: 500;
  line-height: 14px;
  font-size: 12px;
  margin-bottom: 6px;
`;
export const TextGrey = styled.div`
  color: ${({ theme }) => theme.palette.secondary6};
  font-weight: 500;
  line-height: 14px;
  font-size: 12px;
  margin-bottom: 6px;
`;
export const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;
export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;
export const StyledButton = styled(Button)`
  width: 217px;
  height: 37px;
  border-width: 2px;
  padding-left: 1rem;
  color: ${({ theme }) => theme.palette.light};
`;
export const SpaceBetween = styled.div`
  margin-left: 16px;
`;
