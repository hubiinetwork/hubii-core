import styled from 'styled-components';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from 'antd';
import Button from '../ui/Button';

export const Heading = styled(SectionHeading)`
  margin-bottom: 42px;
`;
export const Arrow = styled(Icon)`
  color: ${({ theme, info }) =>
    info === 'true' ? theme.palette.info : theme.palette.secondary6};
  font-size: 20px;
  margin-top: 2px;
  margin-bottom: 2px;
`;

export const ConvertionWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: -13px;
  justify-content: center;
`;

export const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary5};
  flex: 1;
`;

export const BalanceWrapper = styled.div`
  margin-bottom: 30px;
`;

export const AmountWrapper = styled.div`
  margin-bottom: 50px;
`;

export const Left = styled.div`
  border-right: 1px solid ${({ theme }) => theme.palette.secondary5};
  flex: 1;
`;

export const LeftArrow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: -17px;
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
  border: 1px solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 50px;
  top: 80px;
  width: 44px;
  display: flex;
  flex-direction: column;
  height: 44px;
  justify-content: center;
  position: absolute;
  background-color: ${({ theme }) => theme.palette.primary1};
  padding: 4px;
  margin-bottom: 5rem;
`;

export const Conversion = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 30px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: ${({ theme }) => theme.palette.primary1};
  min-width: 220px;
  color: ${({ theme }) => theme.palette.secondary6};
  text-align: center;
  font-size: 12px;
`;

export const Submit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6rem;
`;

export const Exchange = styled(Button)`
  min-width: 300px;
  margin-bottom: 3rem;
  border-width: 2px;
`;
