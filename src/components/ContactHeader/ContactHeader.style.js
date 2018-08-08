import styled from 'styled-components';
import StriimTabs from '../ui/StriimTabs';
import { InputSearch } from '../ui/Input';

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 1.21rem;
  margin-top: -0.5rem;
  justify-content: space-between;
  position: relative;
`;
export const Wrapper = styled.div`
  width: 30%;
  margin-right: 0.71rem;
  position: absolute;
  right: 0;
`;

export const StyledTabs = styled(StriimTabs)`
  .ant-tabs-nav-container {
    max-width: 19.29rem;
  }
`;

export const StyledSearch = styled(InputSearch)`
  i {
    color: ${({ theme }) => theme.palette.light};
  }
  &&&.ant-input-affix-wrapper .ant-input{
    height:1.76rem;
  }
`;
