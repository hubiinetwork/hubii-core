import styled from 'styled-components';

import Text from 'components/ui/Text';

export const Label = styled(Text)`
  color: ${({ theme }) => theme.palette.light};
`;

export const Value = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary1};
  text-align: right;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
