import styled from "styled-components";
import { Row } from "antd";

export const Image = styled.img`
  height: 31.5px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary};
  padding-bottom: 4px;
  margin-top: 3px;
  padding-right: 8px;
`;

export const ETHtoDollar = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.secondary};
`;

const StyledRow = styled(Row)`
  margin-top: 30px;
  .ant-row-flex-top {
    margin-top: 16px;
  }
`;
export const StyledLabel = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-weight: bold;
`;

export { StyledRow as Row };
