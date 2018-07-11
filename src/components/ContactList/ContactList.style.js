import { List } from 'antd';
import styled from 'styled-components';

export const StyledDiv = styled.div`
  margin-top: 15px;
`;
export const StyledList = styled(List)`
  margin-right: 18px;
  margin-left: 0px;
  .ant-list-item-meta-title {
    color: ${({ theme }) => theme.palette.info3};
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
  }
  .ant-list-item-meta-description {
    color: ${({ theme }) => theme.palette.secondary6};
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
  }
  .ant-btn-circle.ant-btn-sm,
  .ant-btn-circle-outline.ant-btn-sm {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.secondary8};
    border-color: ${({ theme }) => theme.palette.secondary8};
  }
  .ant-list-item {
    border-bottom: 1px solid ${({ theme }) => theme.palette.secondary7} !important;
    padding-bottom: 11px;
  }
  em.ant-list-item-action-split {
    display: none;
  }
  .ant-btn.ant-btn-primary.ant-btn-circle.ant-btn-sm.ant-btn-icon-only {
    &:hover {
      color: ${({ theme }) => theme.palette.info};
      background: ${({ theme }) => theme.palette.secondary8} !important;
      border-color: ${({ theme }) => theme.palette.secondary8} !important;
    }
  }
  .ant-list-item-action {
    padding-top: 10px;
  }
  .ant-list-item-action > li {
    padding: 0 4px;
  }
`;