import styled from 'styled-components';

import Button from 'components/ui/Button';
import Text from 'components/ui/Text';
import Heading from 'components/ui/Heading';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopHeading = styled(Heading)`
  color: ${({ theme }) => theme.palette.info};
  margin-bottom: 1.5rem;
`;


export const SecondaryHeader = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
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
