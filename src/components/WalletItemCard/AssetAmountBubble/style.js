import styled from 'styled-components';
import NumericText from 'components/ui/NumericText';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.light};
  background-color: ${({ theme }) => theme.palette.secondary2};
  height: 1.71rem;
  line-height: 1.57rem;
  min-width: 5.71rem;
  padding: 0 0.71rem 0 0.14rem;
  font-size: 0.93rem;
  border-radius: 1.07rem;
`;

export const StyledNumericText = styled(NumericText)`
  display: flex;
  margin-left: 0.43rem;
  cursor: pointer;
`;

export const Image = styled.img`
  height: 1.5rem;
  width: 1.5rem;
`;
