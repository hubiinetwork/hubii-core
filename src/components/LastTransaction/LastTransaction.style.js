import { Row } from 'antd';
import styled from 'styled-components';
import Button from '../ui/Button';

export const Image = styled.img`
  height: 1.71rem;
  width: 1.71rem;
  display: inline-block;
  margin-right: 0.64rem;
`;
export const TransactionInfo = styled.div`
  width: 21rem;
  height: 15.29rem;
  margin-bottom: 4.79rem;
`;
export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info3};
  margin-right: 0.21rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.14rem;
  margin-bottom: 0.43rem;
`;
export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 1.5rem;
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.43rem;
`;
export const TextSecondary = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-weight: 500;
  line-height: 1rem;
  font-size: 0.86rem;
  margin-bottom: 0.43rem;
`;
export const TextGrey = styled.div`
  color: ${({ theme }) => theme.palette.secondary6};
  font-weight: 500;
  line-height: 1rem;
  font-size: 0.86rem;
  margin-bottom: 0.43rem;
`;
export const StyledRow = styled(Row)`
  margin-bottom: 1.43rem;
`;
export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;
export const StyledButton = styled(Button)`
  width: 15.5rem;
  height: 2.64rem;
  border-width: 0.14rem;
  padding-left: 1rem;
  color: ${({ theme }) => theme.palette.light};
`;
export const SpaceBetween = styled.div`
  margin-left: 1.14rem;
`;
