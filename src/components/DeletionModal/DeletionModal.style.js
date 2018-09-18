import styled from 'styled-components';
import Button from 'components/ui/Button';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info};
  font-size: large;
  margin-bottom: 1.5rem;
`;

export const SecondaryHeader = styled.div`
  color: ${({ theme }) => theme.palette.info};
  font-size: large;
  margin: 0.5rem 0 0.5rem;
`;
export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  text-align: center;
`;
export const StyledButton = styled(Button)`
  min-width: 10.71rem;
  padding: 0.5rem 1rem;
  margin: 1rem;
`;
export const ParentDiv = styled.div`
  margin-top: 1.43rem;
  display: flex;
  justify-content: center;
`;
