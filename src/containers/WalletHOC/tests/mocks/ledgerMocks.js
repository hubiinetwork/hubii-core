export const transportMock = {
  debug: false,
  exchangeTimeout: 30000,
  _events: { domain: null, _events: {}, _eventsCount: 0 },
  _appAPIlock: null,
  device: { domain: null, _events: {}, _eventsCount: 1, _raw: {}, _paused: true },
  ledgerTransport: true,
  timeout: 0,
  exchangeStack: [],
};

export const addressMock = { id: 'aksjdfha892374298347kjsdh87238' };

export const ethMock = { getAddress: () => {} };

export const channelMock = {
  take() {},
  flush() {},
  close() {},
};
