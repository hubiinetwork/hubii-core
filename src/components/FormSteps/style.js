import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TextDiv = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  justify-content: center;
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: center;
  margin-top: 2.29rem;
  margin-bottom: 0.86rem;
`;
