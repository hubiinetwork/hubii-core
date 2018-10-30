import styled from 'styled-components';

import Text from 'components/ui/Text';

export const Logo = styled.img`
  border-radius: 50%;
  height: 1.14rem;
  width: 1.14rem;
  margin-right: 0.5rem;
`;

export const Label = styled(Text)`
  color: ${({ theme }) => theme.palette.light};
`;

export const Percentage = styled.div`
  color: ${({ theme }) => theme.palette.info};
  white-space: nowrap;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -0.86rem;
`;

export const FlexItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 1rem 0 0;
  flex-wrap: wrap;
`;
