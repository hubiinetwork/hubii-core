import styled from 'styled-components';
import Button from '../../ui/Button';

export const WrapperIcon = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 80%;
  i {
    display: flex;
    align-items: center;
    font-size: 24px;
  }
  max-width: 65%;
  margin-bottom: 1rem;
`;

export const Result = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Text = styled.div`
  display: flex;
  align-items: center;
  padding-left: 7px;
`;

export const TextWrapper = styled.div`
  text-align: center;
`;

export const ErrorTitle = styled.div`
  color: ${({ theme }) => theme.palette.info};
  font-size: 18px;
  margin-bottom: 15px;
`;

export const ErrorDescription = styled.div`
  margin-top: 18px;
  margin-bottom: 15px;
`;

export const InfoText = styled.span`
  color: ${({ theme }) => theme.palette.info};
`;

export const JustifyCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const Wrapper = styled.div`
  flex: 1;
  .ant-form-item-required:before {
    display: none;
  }
  .ant-form-vertical .ant-form-item {
    padding-bottom: 0px;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
`;
export const StyledButton = styled(Button)`
  margin-top: 30px;
  flex: 0.6;
  margin-bottom: 30px;
`;
