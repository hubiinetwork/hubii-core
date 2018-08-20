import styled from 'styled-components';
import { Icon } from 'antd';

export const OuterWrapper = styled.div`
  display: flex;
  width: 33rem;
  flex-direction: column;
`;

export const DescriptiveIcon = styled(Icon)`
  color: ${(props) => props.active === 'true' ? props.theme.palette.info : null};
  font-size: 1.5rem;
  margin-right: 1rem;
`;

export const SingleRowWrapper = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  width: 33rem;
  border: 0.15rem solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 0.5rem; 
  color: white;
  font-size: 1.25rem;
  padding: 2rem 2rem;
`;

export const SingleRowIcon = styled(Icon)`
  font-size: 3rem;
  margin-right: 2rem;
  color: ${(props) => props.color || props.theme.palette.info};
`;

export const StatusIcon = styled(Icon)`
  font-size: 1.5rem;
  margin-left: auto;
  color: ${(props) => props.type === 'check' ? props.theme.palette.info : null};
`;

export const P = styled.p`
  margin-bottom: 0;
`;

export const Row = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  width: 100%;
  border: ${(props) => props.active ?
    `0.3rem solid ${props.theme.palette.info};` :
    `0.15rem solid ${props.theme.palette.secondary5};`
  };
  color: ${(props) => props.active ? 'white' : `${props.theme.palette.secondary5}`};
  border-radius: ${(props) => {
    if (props.pos === 'top') {
      return '0.5rem 0.5rem 0 0';
    }
    return '0 0 0.5rem 0.5rem';
  }};
  ${(props) => {
    if (!props.active && props.pos === 'top') {
      return `
        border-bottom: 0;
        color: white;
      `;
    }
    if (!props.active && props.pos === 'bottom') {
      return 'border-top: 0';
    }
    return null;
  }};
`;

export const KeyText = styled.span`
  font-weight: bold;
`;
