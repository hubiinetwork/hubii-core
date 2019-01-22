import styled from 'styled-components';

import Text from 'components/ui/Text';

export const Wrapper = styled.div`
&&& {
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.primary3};
  padding: 0.75rem;
  justify-content: flex-start;
}`;

export const Header = styled.div`
  display: flex;
  align-items: baseline;
`;

export const OuterDataWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const InnerDataWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  margin: 0 calc(-0.75rem + 1px);
`;

export const DataRowWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 0 0.75rem;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.palette.secondary7};
  }
`;

export const LastPrice = styled(Text).attrs({
  large: true,
})`
  display: flex;
  padding: auto;
  margin: 0 calc(-0.75rem + 1px);
  justify-content: center;
  background: ${({ theme }) => theme.palette.primary4};
  color: ${({ theme }) => theme.palette.info3};
`;

export const StyledText = styled(Text)`
  ${({ side, theme }) => {
    if (!side) return `color: ${theme.palette.secondary1};`;
    if (side === 'sell') return (`color: ${theme.palette.alert};`);
    return `color: ${theme.palette.success};`;
  }}
  line-height: 1.25rem;
`;