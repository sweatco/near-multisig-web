import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

interface LedgerPathChangePayload {
  contract_id: string
  path: number
}

interface ContractsState {
  contracts: string[]
  ledger?: { [contract_id: string]: number }
}

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState: { contracts: [], ledger: {} } as ContractsState,
  reducers: {
    addContract(state, action: PayloadAction<string[]>) {
      const contractsToAdd = action.payload.filter((contractId) => !state.contracts.includes(contractId))
      state.contracts = contractsToAdd.concat(state.contracts)
    },
    removeContract(state, action: PayloadAction<string>) {
      state.contracts = state.contracts.filter((id) => id !== action.payload)
      delete state.ledger?.[action.payload]
    },
    setLedgerPath(state, action: PayloadAction<LedgerPathChangePayload>) {
      state.ledger = state.ledger ?? {}
      state.ledger[action.payload.contract_id] = action.payload.path
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
