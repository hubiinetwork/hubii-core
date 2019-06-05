import * as React from 'react';
import { Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  Text,
  Wrapper,
  WrapperIcon,
  StyledButton,
  ParentDiv,
} from './style';
/**
 * Modal component for importing a wallet.
 */

// eslint-disable-next-line react/prefer-stateless-function
export class ImportModal extends React.Component {

  render() {
    const { intl, restoreContents } = this.props;
    const { formatMessage } = intl;
    return (
      <Wrapper>
        <WrapperIcon>
          <Icon type="info-circle-o" />
          <Text>
            {
              formatMessage(
                { id: 'batch_import_stats' },
                {
                  walletCount: restoreContents.wallets ? restoreContents.wallets.length : 0,
                  contactCount: restoreContents.contacts ? restoreContents.contacts.length : 0,
                }
              )
            }
          </Text>
        </WrapperIcon>
        <ParentDiv>
          <StyledButton
            type="primary"
            id="button"
            onClick={this.props.onImport}
          >
            {formatMessage({ id: 'import' })}
          </StyledButton>
          <StyledButton
            id="button"
            onClick={this.props.onBack}
          >
            {formatMessage({ id: 'back' })}
          </StyledButton>
        </ParentDiv>
      </Wrapper>
    );
  }
}

ImportModal.propTypes = {
  onImport: PropTypes.func,
  onBack: PropTypes.func,
  restoreContents: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default Form.create()(injectIntl(ImportModal));

