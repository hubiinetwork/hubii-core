import styled from 'styled-components';
import { List, Avatar } from 'antd';
import { InputSearch } from '../ui/Input';

const { Item } = List;

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info3};
  font-family: 'SF Text';
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`;

export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 6px;
  font-family: 'SF Text';
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
`;

export const TextSecondary = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-weight: 400;
  font-size: 13px;
  font-family: 'SF Text';
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
`;

export const StyledListItem = styled(Item)`
  border-bottom-color: ${({ theme }) => theme.palette.secondary4} !important;
  background-color: ${({ active, theme }) =>
    active ? theme.palette.primary4 : null};
  padding-left: 24px;
  padding-right: 16px;
`;

export const AmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-left: 24px;
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
    padding-bottom: 0;
  }
  .ant-list-empty-text {
    color: white;
  }
  .ant-list-item-meta-avatar {
    margin-right: 8px;
  }
  .ant-list-item {
    padding-top: 11px;
    padding-bottom: 5px;
  }
`;

export const StyledAvatar = styled(Avatar)`
  height: 24px;
  width: 24px;
`;
