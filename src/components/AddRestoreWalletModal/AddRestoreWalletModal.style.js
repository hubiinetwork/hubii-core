import styled from 'styled-components';
import { Icon } from 'antd';
import Button from 'components/ui/Button';
import Heading from 'components/ui/Heading';

export const StyledHeading = styled(Heading)`
  margin: 0 2rem 2rem 2rem;
  text-align: center;
`;

export const Container = styled.div`
  padding: 2rem 0;
`;

export const Arrow = styled(Icon)`
  margin-right: 0.43rem;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  display: flex;
`;

export const StyledButton = styled(Button)`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20rem;
  margin-top: 1.72rem;
`;
