import { List } from 'antd';
import styled from 'styled-components';

export const StyledList = styled(List)`
  .ant-list-item-meta-title {
    color: ${({ theme }) => theme.palette.info3};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.14rem;
  }
  .ant-list-item-meta-description {
    color: ${({ theme }) => theme.palette.secondary6};
    font-size: 0.86rem;
    font-weight: 400;
    line-height: 1rem;
  }
  .ant-btn-circle.ant-btn-sm,
  .ant-btn-circle-outline.ant-btn-sm {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.secondary8};
    border-color: ${({ theme }) => theme.palette.secondary8};
  }
  .ant-list-item {
    border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary7} !important;
    padding-bottom: 0.79rem;
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
    padding-top: 0.71rem;
  }
  .ant-list-item-action > li {
    padding: 0 0.29rem;
  }
`;
