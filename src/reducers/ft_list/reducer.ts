import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

type ContractId = string

interface FTListState {
  list: {
    [tokenId: string]: ContractId[]
  }
}

export const ftListSlice = createSlice({
  name: 'ft_list',
  initialState: { list: {} } as FTListState,
  reducers: {
    addFungibleToken(state, action: PayloadAction<{ tokenId: string; contractId: string }>) {
      const { tokenId, contractId } = action.payload
      state.list[tokenId] = state.list[tokenId] ?? []

      if (!state.list[tokenId].includes(contractId)) {
        state.list[tokenId].push(contractId)
      }
    },
  },
})

const persistConfig: PersistConfig<FTListState> = {
  key: ftListSlice.name,
  storage: storage,
  version: 1,
}

export const ftListActions = ftListSlice.actions
const persistedContractsSlice = { ...ftListSlice, reducer: persistReducer(persistConfig, ftListSlice.reducer) }

export default persistedContractsSlice
