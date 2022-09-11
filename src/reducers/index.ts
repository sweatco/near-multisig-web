import { combineReducers } from '@reduxjs/toolkit'

import contracts from './contracts/reducer'
import metadata from './metadata/reducer'
import requests from './requests/reducer'
import ft_list from './ft_list/reducer'
import ft_metadata from './ft_metadata/reducer'

const rootReducer = combineReducers({
  [contracts.name]: contracts.reducer,
  [metadata.name]: metadata.reducer,
  [requests.name]: requests.reducer,
  [ft_list.name]: ft_list.reducer,
  [ft_metadata.name]: ft_metadata.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
