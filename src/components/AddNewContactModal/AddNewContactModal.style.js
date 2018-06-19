import styled from 'styled-components';
import Button from '../ui/Button';

export const WrapperIcon = styled.div `
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 80%;
  max-width: 60%;
  margin-top: 40px;
  i {
    font-size: 24px;
  }
`;
export const Text = styled.div `
  padding-left: 7px;
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
    padding-bottom: 0px;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const StyledButton = styled(Button)`
  margin-top: 30px;
  max-width: 175px;
  margin-bottom: 30px;
  border: 2px solid ${({ theme }) => theme.palette.info3};
  font-family: 'SF Text';
`;
export const ButtonWrapper = styled.div `
  display: flex;
  justify-content: center;
`;
