import { Collapse } from 'antd';
import styled from 'styled-components';

export default styled(Collapse)`
&&&& {
  background: transparent;
  margin-left: -1.07rem;
  .ant-collapse-header {
    color: ${({ theme }) => theme.palette.info};
  }
  .ant-collapse-item {
    border-bottom: none;
  }
  .ant-collapse-content {
    padding-right: 0rem;
  }
  .ant-collapse-header{
    width: fit-content;
  }
  .ant-collapse-content-box {
    padding-right: 0rem;
  }
}
`;

export const Panel = Collapse.Panel;
