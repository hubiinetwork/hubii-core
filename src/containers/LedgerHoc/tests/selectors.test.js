
import { fromJS } from 'immutable';

import {
  makeSelectLedgerHoc,
} from '../selectors';

import {
  ledgerHocConnectedMock,
} from './mocks/selectors';

describe('makeSelectLedgerHoc', () => {
  it('should select the ledgerHoc state', () => {
    const ledgerHocSelector = makeSelectLedgerHoc();
    const mockedState = fromJS({
      ledgerHoc: ledgerHocConnectedMock,
    });
    expect(ledgerHocSelector(mockedState)).toEqual(ledgerHocConnectedMock);
  });
});
