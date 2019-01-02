const Intl = jest.genMockFromModule('react-intl');

Intl.intl = {
  formatMessage: ({ id }, params) => params ? `${id} ${JSON.stringify(params)}` : id,
};

Intl.injectIntl = (Node) => Node;

Intl.defineMessages = (obj) => obj;

module.exports = Intl;
