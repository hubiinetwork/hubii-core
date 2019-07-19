import React from 'react';
import PropTypes from 'prop-types';
import { StyledStep, StepsCentered } from '../ui/Steps';
import { Wrapper } from './style';


const FormSteps = ({ steps, currentStep, beforeContent, afterContent }) => (
  <Wrapper>
    {beforeContent}
    {steps[currentStep].content}
    {afterContent}
    <div>
      <StepsCentered current={currentStep}>
        {steps.map((item) => (
          <StyledStep key={item.title} title={item.title} />
        ))}
      </StepsCentered>
    </div>
  </Wrapper>
);
FormSteps.propTypes = {
  steps: PropTypes.array.isRequired,
  currentStep: PropTypes.number.isRequired,
  beforeContent: PropTypes.node,
  afterContent: PropTypes.node,
};

export default FormSteps;
