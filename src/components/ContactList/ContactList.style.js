import { List } from "antd";
import styled from "styled-components";

export const StyledDiv = styled.div`
  margin-top: 15px;
  margin-left: 15px;
`;
export const StyledList = styled(List)`
  margin-right: 18px;
  margin-left: 20px;
  .ant-list-item-meta-title {
    color: ${({ theme }) => theme.palette.info};
  }
  .ant-list-item-meta-description {
    color: ${({ theme }) => theme.palette.secondary};
  }
  .ant-btn-circle.ant-btn-sm,
  .ant-btn-circle-outline.ant-btn-sm {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.primary4};
    border-color: ${({ theme }) => theme.palette.primary4};
  }
  .ant-list-item {
    border-bottom: 1px solid ${({ theme }) => theme.palette.primary4} !important;
  }
  em.ant-list-item-action-split {
    display: none;
  }
  .ant-btn.ant-btn-primary.ant-btn-circle.ant-btn-sm.ant-btn-icon-only {
    &:hover {
      color: ${({ theme }) => theme.palette.info};
      background: ${({ theme }) => theme.palette.primary4} !important;
      border-color: ${({ theme }) => theme.palette.primary4} !important;
    }
  }
  .ant-list-item-action > li {
    padding: 0 4px;
  }
`;
