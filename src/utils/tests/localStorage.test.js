
import { fromJS } from 'immutable';
import { initialState as walletHocInitialState } from 'containers/WalletHoc/reducer';
import { initialState as contactsInitialState } from 'containers/ContactBook/reducer';
import { loadState, saveState, filterPersistedState } from '../localStorage';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

describe('localStorage', () => {
  describe('loadState', () => {
    it('should return an empty object if state is null', () => {
      const loadedState = loadState();
      const expected = {};
      expect(loadedState).toEqual(expected);
    });

    it('should return state if state exists', () => {
      const state = JSON.stringify({ wallets: ['1', '2', '3'] });
      localStorage.setItem('state', state);
      const loadedState = loadState();
      const expected = JSON.parse(state);
      expect(loadedState).toEqual(expected);
    });

    it('should init the properties from initialState if does not exist in stored state ', () => {
      const wallets = ['1', '2', '3'];
      const state = JSON.stringify({ walletHoc: { wallets } });
      localStorage.setItem('state', state);
      const loadedState = loadState();
      const expected = {
        walletHoc: {
          ...walletHocInitialState.toJSON(),
          wallets, // check non default property
        },
      };
      expect(loadedState).toEqual(expected);
    });
  });

  describe('saveState', () => {
    it('should filter, serialize and set localStorage', () => {
      const state = { data: 123, filtered: false };
      const expected = JSON.stringify({ data: 123, filtered: true });
      const mockFilter = jest.fn();
      mockFilter.mockReturnValue({ ...state, filtered: true });
      saveState(state, mockFilter);
      expect(mockFilter).toHaveBeenCalled();
      expect(localStorage.getItem('state')).toEqual(expected);
    });
  });

  describe('filterPersistedState', () => {
    let state = fromJS({});
    beforeEach(() => {
      state = state.set('contacts', contactsInitialState);
      state = state.set('walletHoc', walletHocInitialState);
    });
    describe('walletHoc state', () => {
      it('should filter saved hardware wallets', () => {
        state = state
          .setIn(['walletHoc', 'wallets', 'hardware'], fromJS({
            wallet1: {
              id: 'encrypted data',
              adderss: '0x0000000',
            },
          }));
        const persistedState = filterPersistedState(state);
        expect(persistedState.getIn(['walletHoc', 'wallets', 'hardware'])).toEqual(state.getIn(['walletHoc', 'wallets', 'hardware']));
      });
      it('should return wallets with decrypted filtered out', () => {
        state = fromJS(
          {
            walletHoc: {
              wallets: [
                {
                  name: 'hello',
                  encrypted: 'encrypted data',
                  decrypted: 'privatekey',
                },
              ],
            },
          }
      );
        const persistedState = filterPersistedState(state);
        expect(persistedState.getIn(['walletHoc', 'wallets', 0, 'decrypted'])).toBeUndefined();
      });
    });
  });
});
