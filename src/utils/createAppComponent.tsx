import React from 'react'

// import { configureAxios } from 'utils/apiHelpers'
import configureStore from './configureStore'

import Root from '../components/Root'

const createAppComponent = (AppComponent: React.ComponentType) => {
  const { store, persistor } = configureStore()
  // configureAxios(store)

  return () => (
    <Root store={store} persistor={persistor}>
      <AppComponent />
    </Root>
  )
}

export default createAppComponent
