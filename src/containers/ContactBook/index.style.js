import styled from 'styled-components';
import { media } from 'utils/style-utils';

export const Wrapper = styled.div`
  width: 100%;
  padding-left: 2rem;
  padding-top: 1rem;
  background: ${({ theme }) => theme.palette.primary1};
  display: flex;
  flex-direction: row;
  ${
    media.desktop`
      flex-direction: column;
    `
  }
`;

export const InnerWrapper1 = styled.div`
  display: ${(props) => props.contactsPresent ? 'block' : 'none'};
  color: white;
  width: 40rem;
`;

export const InnerWrapper2 = styled.div`
  color: white;
  width: 40rem;
  margin-left: 2rem;
  ${
    media.desktop`
      margin-left: 0rem;
      margin-top: 2.5rem;
    `
  }
`;

export const Border = styled.div`
  border-right: solid 1px #43616F;
  margin-top: ${(props) => props.contactsLength ? '1rem' : '2rem'};
`;
