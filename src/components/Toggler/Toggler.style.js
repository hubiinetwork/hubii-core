import styled from 'styled-components';
import { InputSearch } from '../ui/Input';

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 17px;
  justify-content: space-between;
  position: relative;
`;
export const Wrapper = styled.div`
  width: 30%;
  margin-right: 10px;
  position: absolute;
  right: 0;
`;

export const StyledSearch = styled(InputSearch)`
  i {
    color: ${({ theme }) => theme.palette.light};
  }
  &&&.ant-input-affix-wrapper .ant-input{
    height:1.76rem;
  }
`;
