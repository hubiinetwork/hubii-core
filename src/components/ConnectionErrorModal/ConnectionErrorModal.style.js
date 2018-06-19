import styled from 'styled-components';
import Button from '../ui/Button';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Text = styled.p`
  color: ${({ theme }) => theme.palette.info};
  font-size: large;
`;
export const TextPrimary = styled.p`
  color: ${({ theme }) => theme.palette.light};
  text-align: center;
`;
export const StyledButton = styled(Button)`
  min-width: 150px;
  border-width: 2px;
  padding: 0.5rem 1rem;
  margin: 1rem;
  color: ${({ theme }) => theme.palette.light};
`;
