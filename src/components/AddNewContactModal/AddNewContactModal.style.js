import styled from 'styled-components';
import Button from '../ui/Button';

export const WrapperIcon = styled.div `
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 80%;
  max-width: 60%;
  margin-top: 2.86rem;
  i {
    font-size: 1.71rem;
  }
`;
export const Text = styled.div `
  padding-left: 0.5rem;
  font-family: 'SF Text';
`;
export const Wrapper = styled.div `
  .ant-form-item-required:before {
    display: none;
  }
  .ant-form-vertical {
    display: flex;
    width: 67%;
    flex-direction: column;
  }
  .ant-form-vertical .ant-form-item {
    padding-bottom: 0rem;
  }
  .ant-form-item {
    margin-bottom: 0rem;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const StyledButton = styled(Button)`
  margin-top: 2.14rem;
  max-width: 12.5rem;
  margin-bottom: 2.14rem;
  border: 0.14rem solid ${({ theme }) => theme.palette.info3};
  font-family: 'SF Text';
`;
export const ButtonWrapper = styled.div `
  display: flex;
  justify-content: center;
`;
