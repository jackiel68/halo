import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import reducers from './reducers';

const {
  defaultReducer,
  profileReducer,
  companyReducer,
  windowDimensionsReducer,
} = reducers;

const defaultConfig = {
  key: 'defaultReducer',
  storage: storage,
  blacklist: [
    'filters',
    'searchTerm',
  ],
};

const rootReducer = combineReducers({
  defaultReducer: persistReducer(defaultConfig, defaultReducer),
  profiles: profileReducer,
  company: companyReducer,
  window: windowDimensionsReducer,
});

// Redux persist
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['defaultReducer', 'profiles', 'window'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
