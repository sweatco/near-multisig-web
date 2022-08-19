import { configureStore as toolkitConfigureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rootReducer from '../reducers'

const configureStore = () => {
  const persistConfig = {
    storage: storage,
    key: 'root',
    version: 1,
    whitelist: [],
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = toolkitConfigureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

  const persistor = persistStore(store)

  return { store, persistor }
}

export type AppDispatch = ReturnType<typeof configureStore>['store']['dispatch']
export type AppStore = ReturnType<typeof configureStore>['store']

export default configureStore
