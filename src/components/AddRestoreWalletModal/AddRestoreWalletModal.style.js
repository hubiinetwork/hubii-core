import styled from 'styled-components';
import { Icon } from 'antd';
import Button from 'components/ui/Button';

export const TitleDiv = styled.div`
  font-size: 1.6rem;
  margin: 0 2rem;
  text-align: center;
  color: ${({ theme }) => theme.palette.light};
  font-weight: 400;
`;

export const Container = styled.div`
  padding: 2rem 0;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 1rem;
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: center;
`;

export const Arrow = styled(Icon)`
  margin-right: 0.43rem;
  display: flex;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  height: 1.36rem;
  font-weight: 400;
  line-height: 1.36rem;
  font-size: 1.14rem;
  display: flex;
  margin-top: -0.5rem;
  color: ${({ theme }) => theme.palette.light};
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.light1};
  font-size: 0.86rem;
  margin-top: 0.57rem;
  margin-bottom: 3.43rem;
`;

export const ButtonDiv = styled(Button)`
  margin: auto;
  display: flex;
  justify-content: center;
  width: 20rem;
  height: 2.86rem;
  margin-top: 1.72rem;
  margin-bottom: 1.43rem;
`;
