
import { fromJS } from 'immutable';
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
    it('should return wallets with decrypted filtered out', () => {
      const state = fromJS(
        {
          walletManager: {
            wallets: {
              software: {
                wallet1: {
                  encrypted: 'encrypted data',
                  decrypted: 'privatekey',
                },
              },
            },
          },
        }
      );
      const persistedState = filterPersistedState(state);
      expect(persistedState.getIn(['walletManager', 'wallets', 'software', 'wallet1', 'decrypted'])).toBeNull();
    });
  });
});
