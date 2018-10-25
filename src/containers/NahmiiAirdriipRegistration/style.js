import styled from 'styled-components';
import { Alert } from 'antd';

import Button from 'components/ui/Button';
import Heading from 'components/ui/Heading';

export const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
`;

export const PrimaryHeading = styled(Heading)`
  margin-bottom: 1rem;
`;

export const SecondaryHeading = styled(Heading)`
&&&& {
  margin-bottom: 4rem;
}`;

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
  margin: 0 1rem;
  width: 14rem;
}`;

export const NetworkWarning = styled(Alert)`
  margin-bottom: 3rem;
`;

export const StyledButtonTall = styled(StyledButton)`
&&&& {
  height: 4.5rem;
}`;
