
import styled from 'styled-components';
import Table from '../ui/Table';

export const TitleLeft = styled.span`
  color: ${({ theme }) => theme.palette.secondary9} !important;
`;

export const TitleRight = styled.span`
  color: ${({ theme }) => theme.palette.secondary6} !important;
`;

export const PrimaryText = styled.span`
  color: ${({ theme }) => theme.palette.light2} !important;
`;

export const SecondaryText = styled.span`
  color: ${({ theme }) => theme.palette.info3} !important;
  font-size: 13px;
  font-weight: 500;
  line-height: 15px;
`;

export const SuccessText = styled.span`
  color: ${({ theme }) => theme.palette.success} !important;
`;

export const DangerText = styled.span`
  color: ${({ theme }) => theme.palette.danger} !important;
`;

export const AmountWrapper = styled.div`
backgroud-color: ${({ theme }) => theme.palette.secondary10};
display:flex;
justify-content: center;
`;

export const StyledTable = styled(Table)`
  td {
    color: ${({ theme }) => theme.palette.light};
  }
`;
