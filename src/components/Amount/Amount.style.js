import styled from 'styled-components';
import { SectionHeading } from '../ui/SectionHeading';

export const Wrapper = styled(SectionHeading)`
  margin-top: 1rem;
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const AmountWrapper = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 16px;
  font-weight: bold;
  font-size: 18px;
`;

export const Coin = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
`;

export const Amount = styled(SectionHeading)`
  margin-bottom: 0px;
`;
