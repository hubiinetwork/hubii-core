import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import FormSteps from 'components/FormSteps';
import Text from 'components/ui/Text';

import {
  NavigationWrapper,
  Wrapper,
} from './style';

import DecryptForm from './DecryptForm';
import ImportForm from './ImportForm';

class BatchImportSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  getSteps() {
    const { onDecrypt, onImport } = this.props;
    const steps = [
      {
        title: 'First',
        content: (
          <DecryptForm
            onDecrypt={onDecrypt}
          />
        ),
      },
      {
        title: 'Second',
        content: (
          <ImportForm
            onImport={onImport}
          />
        ),
      },
    ];
    return steps;
  }

  handleBack() {
    this.setState(({ current }) => ({ current: current - 1 }));
  }

  handleNext() {
    const { onClose } = this.props;
    this.setState((prev) => {
      const { current } = prev;
      const steps = this.getSteps();
      if (current === steps.length - 1) {
        return onClose();
      }
      return { current: current + 1 };
    });
  }

  render() {
    const { current } = this.state;
    const { formatMessage } = this.props.intl;

    const FormNavigation = (
      <Wrapper>
        <NavigationWrapper>
          <Text large>{formatMessage({ id: 'import_exist_wallet' })}</Text>
        </NavigationWrapper>
      </Wrapper>
    );
    const steps = this.getSteps();
    return (
      <FormSteps steps={steps} currentStep={current} beforeContent={FormNavigation} />
    );
  }
}

BatchImportSteps.propTypes = {
  onImport: PropTypes.func.isRequired,
  onDecrypt: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(BatchImportSteps);
