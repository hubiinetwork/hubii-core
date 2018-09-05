import styled from 'styled-components';
import { Icon } from 'antd';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

export const Heading = styled(SectionHeading)`
  margin-bottom: 3rem;
`;
export const Arrow = styled(Icon)`
  color: ${({ theme, info }) =>
    info === 'true' ? theme.palette.info : theme.palette.secondary6};
  font-size: 1.43rem;
  margin-top: 0.14rem;
  margin-bottom: 0.14rem;
`;

export const ConvertionWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: -0.93rem;
  justify-content: center;
`;

export const Wrapper = styled.div`
  display: flex;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary5};
  flex: 1;
`;

export const BalanceWrapper = styled.div`
  margin-bottom: 2.14rem;
`;

export const AmountWrapper = styled.div`
  margin-bottom: 3.57rem;
`;

export const Left = styled.div`
  border-right: 0.07rem solid ${({ theme }) => theme.palette.secondary5};
  flex: 1;
`;

export const LeftArrow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: -1.21rem;
`;

export const RightArrow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Transfer = styled.div`
  border: 0.07rem solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 3.57rem;
  top: 5.71rem;
  width: 3.14rem;
  display: flex;
  flex-direction: column;
  height: 3.14rem;
  justify-content: center;
  position: absolute;
  background-color: ${({ theme }) => theme.palette.primary1};
  padding: 0.29rem;
  margin-bottom: 5rem;
`;

export const Conversion = styled.div`
  border: 0.07rem solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 2.14rem;
  padding-top: 0.29rem;
  padding-bottom: 0.29rem;
  background-color: ${({ theme }) => theme.palette.primary1};
  min-width: 15.71rem;
  color: ${({ theme }) => theme.palette.secondary6};
  text-align: center;
  font-size: 0.86rem;
`;

export const Submit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6rem;
`;

export const Exchange = styled(Button)`
  min-width: 21.43rem;
  margin-bottom: 3rem;
  border-width: 0.14rem;
`;
