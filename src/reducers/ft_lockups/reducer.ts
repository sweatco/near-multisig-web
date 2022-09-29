import { createSlice } from '@reduxjs/toolkit'
import fetchLockup from '../../actions/chain/fetchLockup'
import { Lockup } from '../../utils/contracts/Lockup'

interface LockupMap {
  [lockupIndex: string]: Lockup
}

interface FTLockupsState {
  lockups: {
    [accountId: string]: {
      [tokenId: string]: {
        [lockupId: string]: LockupMap
      }
    }
  }
}

export const ftLockupsSlice = createSlice({
  name: 'ft_lockups',
  initialState: { lockups: {} } as FTLockupsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLockup.fulfilled, (state, action) => {
      const { contractId, tokenId, lockupId } = action.meta.arg

      state.lockups[contractId] = state.lockups[contractId] ?? {}
      state.lockups[contractId][tokenId] = state.lockups[contractId][tokenId] ?? {}

      const lockups = action.payload.reduce((acc, lockupEntry) => {
        acc[lockupEntry[0]] = lockupEntry[1]
        return acc
      }, {} as LockupMap)

      state.lockups[contractId][tokenId][lockupId] = lockups
    })
  },
})

export const ftLockupsActions = ftLockupsSlice.actions
export default ftLockupsSlice
