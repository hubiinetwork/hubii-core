import { fromJS } from 'immutable';

// makeSelectTrezorHoc
export const trezorHocConnectedMock = fromJS({
  status: 'connected',
  connected: true,
  addresses: {},
  id: 'ajlsdfkjas',
  confTxOnDevice: false,
});

export const trezorHocDisconnectedMock = fromJS({
  status: 'disconnected',
  connected: false,
  addresses: {},
  id: 'ajlsdfkjas',
  confTxOnDevice: false,
});

export const trezorHocConfOnDeviceMock = fromJS({
  status: 'connected',
  connected: true,
  addresses: {},
  id: 'ajlsdfkjas',
  confTxOnDevice: true,
});
