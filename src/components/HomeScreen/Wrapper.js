import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex: 1;
  padding: 0 3rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.palette.primary1};
  overflow-x: hidden;
  overflow-y: scroll;
`;
