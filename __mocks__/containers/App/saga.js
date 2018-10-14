const appSaga = jest.genMockFromModule('containers/App/saga');

appSaga.intl = {
  formatMessage: ({ id }) => id,
};

module.exports = appSaga;
