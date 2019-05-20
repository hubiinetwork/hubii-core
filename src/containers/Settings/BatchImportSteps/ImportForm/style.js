import styled from 'styled-components';
import Button from 'components/ui/Button';

export const WrapperIcon = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 80%;
  max-width: 70%;
  margin-top: 2.86rem;
  i {
    font-size: 1.71rem;
  }
`;
export const Text = styled.div`
  padding-left: 0.5rem;
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
    padding-bottom: 0rem;
  }
  .ant-form-item {
    margin-bottom: 0rem;
  }
  margin-bottom: 2rem;
`;
export const StyledButton = styled(Button)`
  min-width: 9rem;
  margin-right: 2rem;
`;

export const ParentDiv = styled.div`
  margin-top: 1.43rem;
  display: flex;
  justify-content: center;
`;
