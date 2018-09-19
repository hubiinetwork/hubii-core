import { fromJS } from 'immutable';

// makeSelectLedgerHoc
export const ledgerHocDisconnectedMock = fromJS({
  status: 'disconnected',
  addresses: {},
  id: null,
  confTxOnDevice: false,
});

export const ledgerHocConnectedMock = fromJS({
  status: 'connected',
  connected: true,
  addresses: {},
  id: 'ajlsdfkjas',
  confTxOnDevice: false,
});

export const ledgerHocConnectedAppNotOpenMock = fromJS({
  status: 'disconnected',
  connected: true,
  addresses: {},
  id: 'ajlsdfkjas',
  confTxOnDevice: false,
});

export const ledgerHocConfOnDeviceMock = fromJS({
  status: 'connected',
  connected: true,
  addresses: {},
  id: 'ajlsdfkjas',
  confTxOnDevice: true,
});
