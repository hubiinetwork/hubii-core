import styled from 'styled-components';
import NumericText from 'components/ui/NumericText';
import Heading from 'components/ui/Heading';

export const Wrapper = styled.div`
`;

export const StyledNumericText = styled(NumericText)`
`;

export const StyledHeading = styled(Heading)`
  ${StyledNumericText} {
    margin: 0;
    color: ${({ theme }) => theme.palette.light};
    font-size: ${({ large }) => large ? '1.72rem' : '1.43rem'};
  }
`;
