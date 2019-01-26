import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin: 0 2rem 2rem 2rem;
  background: ${({ theme }) => theme.palette.primary1};

  @media (max-width: 70rem) {
    flex-direction: column;
  }
`;

export const RecentContactsWrapper = styled.div`
  display: ${(props) => props.contactsPresent ? 'flex' : 'none'};
  flex-direction: column;
  min-width: 35rem;
  padding: 0 2rem 2rem 2rem;
  flex: 1;
  color: white;

  @media (min-width: 70rem) {
    border-left: solid 1px #43616F;
  }

  @media (max-width: 70rem) {
    margin-top: 2rem;
    padding-left: 0;
  }
`;

export const AllContactsWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  color: white;
  padding: 0 2rem 0 0;
  min-width: 35rem;
`;
