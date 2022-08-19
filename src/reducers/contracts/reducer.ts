import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

interface ContractsState {
  contracts: string[]
}

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState: { contracts: [] } as ContractsState,
  reducers: {
    addContract(state, action: PayloadAction<string>) {
      state.contracts.unshift(action.payload)
    },
    removeContract(state, action: PayloadAction<string>) {
      state.contracts = state.contracts.filter((id) => id !== action.payload)
    },
  },
})

const persistConfig: PersistConfig<ContractsState> = {
  key: contractsSlice.name,
  storage: storage,
  version: 1,
}

export const contractsActions = contractsSlice.actions
const persistedContractsSlice = { ...contractsSlice, reducer: persistReducer(persistConfig, contractsSlice.reducer) }

export default persistedContractsSlice
