import React from 'react';
import { shell } from 'electron';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import emoji from 'emoji-dictionary';
import { injectIntl } from 'react-intl';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { Modal } from 'components/ui/Modal';
import { OWNER, REPO } from 'config/constants';

import {
  ButtonDiv,
  StyledButton,
  StyledDetailsButton,
  TitleDiv,
  TextWhite,
  Container,
} from './style';

import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import { makeSelectReleaseNotes } from './selectors';

class ReleaseNotesModal extends React.PureComponent {
  render() {
    const emojiSupport = (text) => text.replace(/:\w+:/gi, (name) => emoji.getUnicode(name));
    const { formatMessage } = this.props.intl;
    return (
      <Modal
        footer={null}
        width={'41.79rem'}
        maskClosable
        style={{ marginTop: '1.43rem' }}
        visible={this.props.releaseNotes.show}
        onCancel={this.props.hideReleaseNotes}
        destroyOnClose
      >
        <TitleDiv>
          {`${formatMessage({ id: 'new_version_available' })} - ${this.props.releaseNotes.version}`}
        </TitleDiv>
        <Container>
          <ReactMarkdown source={this.props.releaseNotes.body} renderers={{ text: emojiSupport }} />
        </Container>
        <ButtonDiv>
          <StyledButton type="primary" onClick={this.props.installNewRelease}>
            <TextWhite>{formatMessage({ id: 'upgrade' })}</TextWhite>
          </StyledButton>
          <StyledDetailsButton onClick={() => { shell.openExternal(`https://github.com/${OWNER}/${REPO}/releases/tag/${this.props.releaseNotes.version}`); }}>
            <TextWhite>{formatMessage({ id: 'view_details' })}</TextWhite>
          </StyledDetailsButton>
        </ButtonDiv>
      </Modal>
    );
  }
}

ReleaseNotesModal.propTypes = {
  releaseNotes: PropTypes.object.isRequired,
  hideReleaseNotes: PropTypes.func.isRequired,
  installNewRelease: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const withReducer = injectReducer({ key: 'releaseNotes', reducer });
const withSaga = injectSaga({ key: 'releaseNotes', saga });

const mapStateToProps = createStructuredSelector({
  releaseNotes: makeSelectReleaseNotes(),
});
function mapDispatchToProps(dispatch) {
  return {
    hideReleaseNotes: () => dispatch(actions.hideReleaseNotes()),
    installNewRelease: () => dispatch(actions.installNewRelease()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(ReleaseNotesModal));
