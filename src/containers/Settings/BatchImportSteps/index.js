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
  }

  componentDidUpdate(prevProps) {
    if (this.props.restoreContents && this.props.restoreContents !== prevProps.restoreContents) {
      this.setState({current: 1});// eslint-disable-line
    }
  }

  getSteps() {
    const { onDecrypt, onImport, restoreContents } = this.props;
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
            onBack={this.handleBack}
            restoreContents={restoreContents}
          />
        ),
      },
    ];
    return steps;
  }

  handleBack() {
    this.setState({ current: 0 });
  }

  render() {
    const { current } = this.state;
    const { formatMessage } = this.props.intl;

    const FormNavigation = (
      <Wrapper>
        <NavigationWrapper>
          <Text large>{formatMessage({ id: 'batch_import' })}</Text>
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
  restoreContents: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(BatchImportSteps);
