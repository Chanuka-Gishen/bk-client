import { persistStore, persistReducer } from 'redux-persist';
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducer/authReducer';
import snackbarReducer from './reducer/snackbarReducer';
import { crossBrowserListener } from './config/persistListener';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { composeWithDevTools } from 'redux-devtools-extension';
import { thunk } from 'redux-thunk';
import menuReducer from './reducer/menuReducer';

const allPersistReducers = combineReducers({
  menu: menuReducer,
  auth: authReducer,
  snackbar: snackbarReducer,
});

const encryptor = encryptTransform({
  secretKey: 'asdasdadasd',
  onError: function (error) {
    // Handle the error.
  },
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['snackbarReducer'],
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, allPersistReducers);

export const reduxPersistStore = createStore(
  persistedReducer,
  composeWithDevTools(),
  applyMiddleware(thunk)
);

window.addEventListener('storage', crossBrowserListener(reduxPersistStore, persistConfig));

export const persistedStore = persistStore(reduxPersistStore);
