import styled from 'styled-components';
import { SectionHeading } from '../ui/SectionHeading';

export const Wrapper = styled(SectionHeading)`
  // margin-top: 1rem;
  // margin-bottom: 3rem;
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const AmountWrapper = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 16px;
  font-size: 20px;
  font-weight: 400;
`;

export const Coin = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 14px;
`;

export const Title = styled(SectionHeading)`
  margin-bottom: 0px;
`;

export const DollarAmount = styled(Title)`
  font-size: 14px;
`;
