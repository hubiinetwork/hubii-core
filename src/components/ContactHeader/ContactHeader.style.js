import styled from 'styled-components';
import StriimTabs from '../ui/StriimTabs';
import { InputSearch } from '../ui/Input';

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 17px;
  margin-top: -7px;
  margin-left: 15px;
  justify-content: space-between;
  position: relative;
`;
export const Wrapper = styled.div`
  width: 30%;
  margin-right: 10px;
  position: absolute;
  right: 0;
`;

export const StyledTabs = styled(StriimTabs)`
  .ant-tabs-nav-container {
    max-width: 270px;
  }
`;

export const StyledSearch = styled(InputSearch)`
  i {
    color: ${({ theme }) => theme.palette.light};
  }
`;
