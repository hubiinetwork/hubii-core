import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { getAbsolutePath } from 'utils/electron';

import Heading from 'components/ui/Heading';

import {
  Wrapper,
  TopHeader,
  Title,
  Container,
  Logo,
} from './style';

export const Dex = (props) => {
  const { formatMessage } = props.intl;

  return (
    <Wrapper>
      <TopHeader>
        <Heading>{formatMessage({ id: 'exchange' })}</Heading>
      </TopHeader>
      <Container>
        <Logo src={getAbsolutePath('public/images/hubii-core-logo-wtext.svg')} />
        <Title>
          {formatMessage({ id: 'dex_coming_soon' })}
        </Title>
      </Container>
    </Wrapper>
  );
};

Dex.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Dex);
