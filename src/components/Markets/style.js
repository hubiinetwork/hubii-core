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

export const DataWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
`;

export const DataRowWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  transition: all 0.2s;
  padding: 0 0.75rem;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.palette.secondary7};
  };
  ${({ selected, theme }) =>
    selected ? `
    background: ${theme.palette.secondary7};
    padding: 0.33rem 1.25rem;
    &:hover {
      cursor: auto;
      background: ${theme.palette.secondary7};
    }
  ` : ''
  };
`;

export const StyledText = styled(Text)`
  ${({ change, theme }) => {
    if (!change) return `color: ${theme.palette.secondary1};`;
    if (change < 0) return (`color: ${theme.palette.alert};`);
    return `color: ${theme.palette.success};`;
  }}
  line-height: 1.5rem;
  width: 25%;
`;
