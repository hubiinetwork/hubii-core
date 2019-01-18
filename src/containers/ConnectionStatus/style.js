import styled from 'styled-components';
import { Icon } from 'antd';
import Text from 'components/ui/Text';

export const Wrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 0 0 5rem 5rem;
  width: 28rem;
  height: 2.6rem;
  background:rgba(0,0,0,0.33);
  top: 0;
  left: calc(50vw - 14rem + 2.6rem);
`;

export const StatusIcon = styled(Icon)`
  color: ${({ theme, warning }) => warning ? 'yellow' : theme.palette.success1};
  font-size: 1.25rem;
`;

export const StyledText = styled(Text)`
  ${({ warning }) => warning ? `
    color: yellow;
  ` : ''}
`;
