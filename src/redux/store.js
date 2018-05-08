import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from './reducers';

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

export default (initialState = initialState) => {
  const store = createStore(
    persistedReducer,
    {},
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
  const persistor = persistStore(store);
  return store;
};
