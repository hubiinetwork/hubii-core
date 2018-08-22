import styled from 'styled-components';
import { List, Avatar } from 'antd';
import Price from 'components/Price';
import { InputSearch } from '../ui/Input';

const { Item } = List;

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info3};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.14rem;
`;

export const TextPrimary = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 0.43rem;
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
`;

export const TextSecondary = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-weight: 400;
  font-size: 0.93rem;
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
`;

export const StyledListItem = styled(Item)`
  border-bottom-color: ${({ theme }) => theme.palette.secondary4} !important;
  background-color: ${({ active, theme }) =>
    active ? theme.palette.primary4 : null};
  padding-left: 1.71rem;
  padding-right: 1.14rem;
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
  padding-left: 1.71rem;
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
    margin-right: 0.57rem;
  }
  .ant-list-item {
    padding-top: 0.79rem;
    padding-bottom: 0.36rem;
  }
`;

export const StyledAvatar = styled(Avatar)`
  height: 1.71rem;
  width: 1.71rem;
`;

export const StyledPrice = styled(Price)``;
