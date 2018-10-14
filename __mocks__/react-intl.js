const Intl = jest.genMockFromModule('react-intl');

Intl.intl = {
  formatMessage: ({id}) => id
};

Intl.injectIntl = (Node) => Node

Intl.defineMessages = (obj) => obj

module.exports = Intl;