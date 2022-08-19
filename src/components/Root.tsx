import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { Store } from '@reduxjs/toolkit'
import React from 'react'
import { Provider } from 'react-redux'
import { Persistor } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

interface RootProps {
  persistor: Persistor
  store: Store
}

const Root: React.FC<React.PropsWithChildren<RootProps>> = ({ store, persistor, children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default Root
