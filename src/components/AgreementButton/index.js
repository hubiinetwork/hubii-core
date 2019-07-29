
import React from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { Wrapper, StyledButton, StyledCheckBox, AgreementText, TermsLink } from './style';

class AgreementButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { agreed: false };
    this.changeAgreement = this.changeAgreement.bind(this);
  }

  changeAgreement(e) {
    this.setState({ agreed: e.target.checked });
  }

  render() {
    const { disabled, children, intl } = this.props;
    const { formatMessage } = intl;
    const { agreed } = this.state;

    return (
      <Wrapper>
        <StyledCheckBox onChange={this.changeAgreement}>
          <AgreementText>
            {formatMessage({ id: 'i_agree' })}
            <TermsLink
              onClick={() => {
                shell.openExternal('https://github.com/hubiinetwork/nahmii-contracts/blob/develop/TERMS.md');
              }}
            >
              {formatMessage({ id: 'terms' })}
            </TermsLink>
          </AgreementText>
        </StyledCheckBox>
        <StyledButton
          {...this.props}
          disabled={!agreed || disabled}
        >
          {children}
        </StyledButton>
      </Wrapper>
    );
  }
}

AgreementButton.propTypes = {
  children: PropTypes.any,
  intl: PropTypes.object,
  disabled: PropTypes.bool,
};

export default compose(
  injectIntl
)(AgreementButton);

