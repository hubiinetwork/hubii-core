import styled from 'styled-components';

import Button from 'components/ui/Button';

export const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
`;

export const StartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledButton = styled(Button)`
&&&& {
  margin: 3rem 1rem;
  width: 14rem;
}`;


export const StyledButtonTall = styled(StyledButton)`
&&&& {
  height: 4.5rem;
}`;
