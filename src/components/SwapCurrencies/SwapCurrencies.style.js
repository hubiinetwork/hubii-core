import styled from 'styled-components';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from 'antd';
import Button from '../ui/Button';

export const Heading = styled(SectionHeading)`
  margin-bottom: 2rem;
`;
export const Arrow = styled(Icon)`
  color: ${({ theme, info }) =>
    info === 'true' ? theme.palette.info : theme.palette.secondary1};
  font-size: 25px;
`;

export const ConvertionWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: -21px;
  justify-content: center;
`;

export const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
  flex: 1;
`;

export const Left = styled.div`
  border-right: 1px solid ${({ theme }) => theme.palette.secondary1};
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
  border: 1px solid ${({ theme }) => theme.palette.secondary1};
  border-radius: 50px;
  top: 80px;
  width: 50px;
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: center;
  position: absolute;
  background-color: ${({ theme }) => theme.palette.primary1};
  padding: 4px;
  margin-bottom: 5rem;
`;

export const Conversion = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.secondary1};
  border-radius: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: ${({ theme }) => theme.palette.primary1};
  min-width: 250px;
  color: ${({ theme }) => theme.palette.secondary1};
  text-align: center;
`;

export const Submit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6rem;
`;

export const Exchange = styled(Button)`
  min-width: 250px;
  margin-bottom: 3rem;
`;
