import styled from 'styled-components';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

export const TextDullWhite = styled.div`
  color: ${({ theme }) => theme.palette.light1};
  display: flex;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.14rem;
`;

export const ItemWrapper = styled.div`
  margin-top: 1.3rem;
`;

export const LeftFlex = styled.div`
  display: flex;
  flex: 0.7;
  justify-content: space-between;
  align-items: center;
  margin-right: 4.64rem;
`;

export const RightFlex = styled.div`
  display: flex;
  flex: 0.3;
  justify-content: space-between;
  align-items: center;
}}
`;

export const TimePast = styled.div`
  color: ${({ theme }) => theme.palette.secondary4};
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: right;
  margin-right: 2.3rem;
`;

export const CollapseLeft = styled.div`
  border-right: 0.07rem solid ${({ theme }) => theme.palette.secondary7};
  margin-top: 1rem;
  flex: 0.7;
`;

export const CollapseRight = styled.div`
  flex: 0.3;
  margin-top: 1rem;
  margin-left: 1rem;
`;

export const CollapseParent = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 1rem;
`;

export const Amount = styled.div`
  color: ${({ theme }) => theme.palette.secondary6};
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1.14rem;
`;

export const PaymentHistoryAddress = styled.div`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
  margin-left: 0.21rem;
  margin-right: 0.21rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 19rem;
  font-weight: 400;
  line-height: 1.14rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

export const DetailCollapse = styled(Collapse)`
  border-width: 0rem;
  padding: 0rem;
  background-color: transparent;
  flex: 1;
  display: flex;
  align-items: center;
  .ant-collapse-header {
    padding: 0rem !important;
  }
  .ant-collapse-content {
    padding-left: 0rem !important;
  }
  .ant-collapse-content-box {
    padding-top: 0.57rem !important;
    padding: 0rem !important;
  }
`;

export const DetailPanel = styled(Panel)`
  padding: 0rem;
  flex: 1;
  .ant-collapse-header {
    flex: 1;
    &:focus {
      border: 0rem solid red;
    }
  }
`;

export const TextGrey = styled.div`
  color: ${({ theme }) => theme.palette.secondary6};
  margin-bottom: 0rem;
  margin-right: 0.36rem;
  font-size: 0.94rem;
  font-weight: 400;
  line-height: 1.14rem;
`;
