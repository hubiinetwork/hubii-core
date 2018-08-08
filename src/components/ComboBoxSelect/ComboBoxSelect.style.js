import styled from 'styled-components';
import Select from 'components/ui/Select';

export const StyledSelect = styled(Select)`
  .ant-select-selection{
    box-shadow: none;
  }
  color: ${({ theme }) => theme.palette.info};
  .ant-select-selection-selected-value {
    color: ${({ theme }) => theme.palette.light};
  }
`;
