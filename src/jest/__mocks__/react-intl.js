const Intl = jest.genMockFromModule('react-intl');

Intl.intl = {
  formatMessage: ({ id }, params) => params ? `${id} ${JSON.stringify(params)}` : id,
  formatNumber: (value, params) => params ? `${value} ${JSON.stringify(params)}` : value,
};

Intl.injectIntl = (Node) => Node;

Intl.defineMessages = (obj) => obj;

module.exports = Intl;
