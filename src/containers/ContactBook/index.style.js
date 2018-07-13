import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding-left: 2rem;
  padding-top: 1rem;
  background: ${({ theme }) => theme.palette.primary1};
  display: flex;
  flex-direction: row;
`;

export const InnerWrapper1 = styled.div`
  color: white;
  min-width: 35rem;
`;

export const InnerWrapper2 = styled.div`
  color: white;
  min-width: 35rem;
  margin-left: 1rem;
`;

export const Border = styled.div`
  border-right: solid 1px #43616F;
  margin-top: ${(props) => props.contactsLength ? '1rem' : '2rem'};
`;
