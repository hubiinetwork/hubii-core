import { Row } from 'antd';
import styled from 'styled-components';
import Button from '../ui/Button';

export const Image = styled.img`
  height: 25px;
  width: 25px;
  display: inline-block;
  margin-right: 9px;
`;
export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info};
  margin-right: 3px;
`;
export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 1.5rem;
`;
export const TextSecondary = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-weight: 400;
  font-size: 13px;
`;
export const StyledRow = styled(Row)`
  margin-bottom: 1rem;
`;
export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;
export const StyledButton = styled(Button)`
  min-width: 150px;
  border-width: 2px;
  padding: 0.5rem 1rem;
  margin: 1rem;
  color: ${({ theme }) => theme.palette.light};
`;
export const SpaceBetween = styled.div`
  margin-left: 1rem;
`;
