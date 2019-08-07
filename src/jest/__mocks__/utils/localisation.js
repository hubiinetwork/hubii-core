const appSaga = jest.genMockFromModule('utils/localisation');

appSaga.getIntl = () => ({
  formatMessage: ({ id }, params) => (
    params ? `${id},${Object.keys(params).map((key) => `${key}:${params[key]}`).join(',')}` : id
  ),
});

module.exports = appSaga;
