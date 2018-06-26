import React from 'react';
import PropTypes from 'prop-types';
import { StyledStep, StepsCentered } from '../ui/Steps';
import { SpaceBetween, TextDiv } from './formSteps.style';

const FormSteps = ({ steps, currentStep, beforeContent, afterContent }) => (
  <SpaceBetween>
    {beforeContent}
    {steps[currentStep].content}
    {afterContent}
    <div>
      <TextDiv>
        Step {currentStep + 1} of {steps.length}
      </TextDiv>
      <StepsCentered current={currentStep}>
        {steps.map((item) => (
          <StyledStep key={item.title} title={item.title} />
            ))}
      </StepsCentered>
    </div>
  </SpaceBetween>
  );
FormSteps.propTypes = {
  steps: PropTypes.array,
  currentStep: PropTypes.number,
  beforeContent: PropTypes.node,
  afterContent: PropTypes.node,
};
export default FormSteps;
