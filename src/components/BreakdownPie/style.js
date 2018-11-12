import styled from 'styled-components';

import Text from 'components/ui/Text';


export const Title = styled(Text)`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 0.21rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
