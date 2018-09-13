
import { fromJS } from 'immutable';

import {
  makeSelectTrezorHoc,
} from '../selectors';

import {
  trezorHocConnectedMock,
} from './mocks/selectors';

describe('makeSelectTrezorHoc', () => {
  it('should select the trezorHoc state', () => {
    const ledgerHocSelector = makeSelectTrezorHoc();
    const mockedState = fromJS({
      trezorHoc: trezorHocConnectedMock,
    });
    expect(ledgerHocSelector(mockedState)).toEqual(trezorHocConnectedMock);
  });
});
