import styled from 'styled-components';

import Text from 'components/ui/Text';

export const Wrapper = styled.div`
&&& {
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.primary4};
  justify-content: flex-start;
}`;

export const Header = styled.div`
  display: flex;
  padding: 0.75rem 0.75rem 0 0.75rem;
  align-items: baseline;
`;

export const InnerDataWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
`;

export const DataRowWrapper = styled.div`
  display: flex;
  transition: all 0.2s;
  padding: 0 0.75rem;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.palette.secondary7};
    padding: 0.33rem 0.5rem;
  }
`;

export const StyledText = styled(Text)`
  ${({ side, theme }) => {
    if (!side) return `color: ${theme.palette.secondary1};`;
    if (side === 'sell') return (`color: ${theme.palette.alert};`);
    return `color: ${theme.palette.success};`;
  }}
  line-height: 1.5rem;
  width: 25%;
`;
