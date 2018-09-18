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
  margin-bottom: 0.5rem;
`;

export const SecondaryHeader = styled.div`
  color: ${({ theme }) => theme.palette.info};
  font-size: medium;
  margin: 0.5rem 0 0.5rem 2rem;
`;

export const PrimaryHeader = styled.div`
  color: ${({ theme }) => theme.palette.info};
  font-size: medium;
  margin: 0.5rem 0 0.5rem 0rem;
`;

export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 1rem;
  text-align: center;
`;
export const StyledIcon = styled(Button)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.secondary1};
  background: ${({ theme }) => theme.palette.secondary8};
  border-color: ${({ theme }) => theme.palette.secondary8};
  &:hover {
      color: ${({ theme }) => theme.palette.info};
      background: ${({ theme }) => theme.palette.secondary8} !important;
      border-color: ${({ theme }) => theme.palette.secondary8} !important;
    }
`;

export const StyledButton = styled(Button)`
  min-width: 10.71rem;
  border-width: 0.14rem;
  padding: 0.5rem 1rem;
  margin: 1rem;
  color: ${({ theme }) => theme.palette.light};
`;

export const ParentDiv = styled.div`
  margin-top: 1.43rem;
  display: flex;
  justify-content: center;
`;
