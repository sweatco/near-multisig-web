import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createMigrate, PersistConfig, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

type TokenId = string
type LockupId = string

interface FTListState {
  list: {
    [contractId: string]: TokenId[]
  }
  lockups: {
    [contractId: string]: {
      [tokenId: string]: LockupId[]
    }
  }
}

export const ftListSlice = createSlice({
  name: 'ft_list',
  initialState: { list: {}, lockups: {} } as FTListState,
  reducers: {
    addFungibleToken(state, action: PayloadAction<{ contractId: string; tokenId: string }>) {
      const { contractId, tokenId } = action.payload
      state.list[contractId] = state.list[contractId] ?? []

      if (!state.list[contractId].includes(tokenId)) {
        state.list[contractId].push(tokenId)
      }
    },

    deleteFungibleToken(state, action: PayloadAction<{ contractId: string; tokenId: string }>) {
      const { contractId, tokenId } = action.payload
      state.list[contractId] = state.list[contractId] ?? []
      state.list[contractId] = state.list[contractId].filter((tid) => tid !== tokenId)

      if (state.list[contractId].length === 0) {
        delete state.list[contractId]
      }

      // Delete lockups
      if (state.lockups[contractId]) {
        delete state.lockups[contractId][tokenId]
      }
    },

    addLockup(state, action: PayloadAction<{ contractId: string; tokenId: string; lockupId: string }>) {
      const { contractId, tokenId, lockupId } = action.payload
      state.lockups[contractId] = state.lockups[contractId] ?? {}
      state.lockups[contractId][tokenId] = state.lockups[contractId][tokenId] ?? []

      if (!state.lockups[contractId][tokenId].includes(lockupId)) {
        state.lockups[contractId][tokenId].push(lockupId)
      }
    },

    deleteLockup(state, action: PayloadAction<{ contractId: string; tokenId: string; lockupId: string }>) {
      const { contractId, tokenId, lockupId } = action.payload
      state.lockups[contractId] = state.lockups[contractId] ?? {}
      state.lockups[contractId][tokenId] = state.lockups[contractId][tokenId] ?? []

      state.lockups[contractId][tokenId] = state.lockups[contractId][tokenId].filter((lid) => lid !== lockupId)
      if (state.lockups[contractId][tokenId].length === 0) {
        delete state.lockups[contractId][tokenId]
      }
      if (Object.keys(state.lockups[contractId]).length === 0) {
        delete state.lockups[contractId]
      }
    },
  },
})

const migrations = {
  2: (state: any) => {
    let newList: FTListState['list'] = {}
    Object.entries(state.list as { [tokenId: string]: string[] }).forEach(([tokenId, contractList]) => {
      for (const contractId of contractList) {
        newList[contractId] = newList[contractId] ?? []
        newList[contractId].push(tokenId)
      }
    })
    return {
      ...state,
      list: newList,
      lockups: {},
    }
  },
}

const persistConfig: PersistConfig<FTListState> = {
  key: ftListSlice.name,
  storage: storage,
  version: 2,
  migrate: createMigrate(migrations),
}

export const ftListActions = ftListSlice.actions
const persistedContractsSlice = { ...ftListSlice, reducer: persistReducer(persistConfig, ftListSlice.reducer) }

export default persistedContractsSlice
