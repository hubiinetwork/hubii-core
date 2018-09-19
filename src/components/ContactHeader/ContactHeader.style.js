import styled from 'styled-components';
import { InputSearch } from '../ui/Input';

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  align-items: center;
  font-size: 1.21rem;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  width: 30%;
`;

export const StyledSearch = styled(InputSearch)`
  i {
    color: ${({ theme }) => theme.palette.light};
  }
  &&&.ant-input-affix-wrapper .ant-input{
    height:1.76rem;
  }
`;
