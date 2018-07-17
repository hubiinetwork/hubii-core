import styled from 'styled-components';
import { Table } from 'antd';

export default styled(Table)`
  th,
  td {
    padding: 1px 15px !important;
    border: 0px !important;
    font-weight: 500;
    background: none !important;
  }
  th {
    font-size: 12px;
    line-height: 14px;
  }
  td {
    font-size: 11px;
    line-height: 13px;
  }
  .ant-table-small {
    border: none;
  }
`;
