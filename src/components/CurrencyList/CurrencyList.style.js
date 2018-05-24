import styled from 'styled-components';
import { List } from 'antd';
import { InputSearch } from '../ui/Input';

const { Item } = List;

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info};
`;

export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 6px;
`;

export const TextSecondary = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-weight: 400;
  font-size: 13px;
`;

export const StyledListItem = styled(Item)`
  border-bottom-color: ${({ theme }) => theme.palette.secondary4} !important;
  background-color: ${({ active, theme }) =>
    active ? theme.palette.secondary3 : null};
`;

export const AmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledSearch = styled(InputSearch)`
  max-width: 60%;
  i {
    color: ${({ theme }) => theme.palette.light};
  }
`;

export const StyledList = styled(List)`
  .ant-list-header {
    border-bottom: 0;
  }
  .ant-list-empty-text {
    color: white;
  }
`;
