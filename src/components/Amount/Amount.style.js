import styled from 'styled-components';
import SectionHeading from '../ui/SectionHeading';

export const Wrapper = styled(SectionHeading)``;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const AmountWrapper = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 1.14rem;
  font-size: 1.43rem;
  font-weight: 400;
`;

export const Coin = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 1rem;
`;

export const Title = styled(SectionHeading)`
  margin-bottom: 0rem;
`;

export const DollarAmount = styled(Title)`
  font-size: 1rem;
`;
