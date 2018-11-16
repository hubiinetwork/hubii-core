import styled from 'styled-components';

export const Wrapper = styled.div`
  display: block;
  ${(props) => props.allowOverflow ? '' : 'max-height: 80vh; overflow: hidden;'}
`;
