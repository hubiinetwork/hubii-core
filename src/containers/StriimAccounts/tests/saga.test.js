import { put, takeLatest } from 'redux-saga/effects';
import listenStriimAccountsData, { getInfo } from '../saga';
import { LOAD_STRIIM_ACCOUNTS } from '../constants';
import {
  striimAccountsLoaded,
  striimAccountsLoadingError,
} from '../actions';

describe('getInfo Saga', () => {
  let getInfoGenerator;

  beforeEach(() => {
    getInfoGenerator = getInfo();

    getInfoGenerator.next();
  });

  it('should dispatch the striimAccountsLoaded action if it requests the data successfully', () => {
    const response = [];
    // yield returned data
    getInfoGenerator.next(response);
    // proceed delay simulation
    const putDescriptor = getInfoGenerator.next().value;
    expect(putDescriptor).toEqual(put(striimAccountsLoaded(response)));
  });

  it('should call the striimAccountsLoadingError action if the response errors', () => {
    const response = new Error('Some error');
    const putDescriptor = getInfoGenerator.throw(response).value;
    expect(putDescriptor).toEqual(put(striimAccountsLoadingError(response)));
  });
});

describe('root Saga', () => {
  const striimAccountsSaga = listenStriimAccountsData();

  it('should start task to watch for LOAD_STRIIM_ACCOUNTS action', () => {
    const takeLatestDescriptor = striimAccountsSaga.next().value;
    expect(takeLatestDescriptor).toEqual(takeLatest(LOAD_STRIIM_ACCOUNTS, getInfo));
  });
});
