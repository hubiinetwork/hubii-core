const appSaga = jest.genMockFromModule('utils/localisation');

appSaga.getIntl = () => ({ formatMessage: ({ id }) => id });

module.exports = appSaga;
