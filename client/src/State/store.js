import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice'
import socketReducer from './SocketSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER  } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
  }

  const rootReducer = combineReducers({
    user: userReducer,
    socket: socketReducer
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  export const store = configureStore({
    /*reducer: {
      users: persistedReducer, // Wrap in an object with a slice name
    },*/
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const persistor = persistStore(store);