import { fromJS } from 'immutable';


// makeSelectBlockHeight
export const blockHeightLoadedMock = fromJS({
  loading: false,
  error: null,
  height: 3780093,
});

export const blockHeightLoadingMock = fromJS({
  loading: true,
  error: null,
  height: -1,
});

export const blockHeightErrorMock = fromJS({
  loading: false,
  error: true,
  height: 123,
});

export const ethOperationsHocMock = fromJS({
  blockHeight: blockHeightLoadedMock,
});
