import initialState from './initialState';
import {
  WALLETS_ERROR,
  WALLETS_SUCCESS,
  WALLETS_LOADING,
  WALLETS_DELETE
} from './constants';

export default (state = initialState, action) => {
  switch (action.type) {
    case WALLETS_LOADING: {
      return { ...state, loading: true, error: false };
    }
    case WALLETS_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: state.data.concat(action.wallet)
      };
    }
    case WALLETS_ERROR: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }
    case WALLETS_DELETE: {
      const walletArray = {
        ...state,
        data: state.data.filter(item => {
          return item.credentials.address !== action.address;
        })
      };
      return walletArray;
    }
    default:
      return state;
  }
};
