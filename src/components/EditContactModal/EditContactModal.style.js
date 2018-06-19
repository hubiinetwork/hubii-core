import styled from 'styled-components';
import Button from '../ui/Button';

export const WrapperIcon = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 80%;
  max-width: 70%;
  margin-top: 40px;
  i {
    font-size: 24px;
  }
`;
export const Text = styled.div`
  padding-left: 7px;
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .ant-form-item-required:before {
    display: none;
  }
  .ant-form-vertical {
    display: flex;
    width: 70%;
    flex-direction: column;
  }
  .ant-form-vertical .ant-form-item {
    padding-bottom: 0px;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
`;
export const StyledButton1 = styled(Button)`
  min-width: 160px;
  border: 2px solid ${({ theme }) => theme.palette.info3};
`;
export const StyledButton2 = styled(Button)`
  min-width: 160px;
  margin-left: 39px;
  border: 2px solid ${({ theme }) => theme.palette.info3};
`;
export const ParentDiv = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;
