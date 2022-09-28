import { createSelector } from '@reduxjs/toolkit'
import { BN } from '../../utils/formatBalance'
import { RootState } from '../index'

import ftLockupsSlice from './reducer'

export const getFTLockupsSlice = (state: RootState) => state[ftLockupsSlice.name]

export const getFTLockups = (state: RootState) => getFTLockupsSlice(state).lockups

export const makeLockupsSelector = () => {
  const getContractId = (_: any, contractId: string) => contractId
  const getTokenId = (_: any, __: any, tokenId: string) => tokenId
  const getLockupId = (_: any, __: any, ___: any, lockupId: string) => lockupId

  const lockupsSelector = createSelector(
    getFTLockups,
    getContractId,
    getTokenId,
    getLockupId,
    (lockups, contractId, tokenId, lockupId) => {
      return ((lockups[contractId] ?? {})[tokenId] ?? {})[lockupId]
    }
  )

  return createSelector(lockupsSelector, (lockups) => {
    if (!lockups || Object.values(lockups).length === 0) {
      return
    }

    let claimed_balance = BN(0)
    let total_balance = BN(0)
    let unclaimed_balance = BN(0)

    Object.values(lockups).forEach((lockup) => {
      claimed_balance = claimed_balance.plus(BN(lockup.claimed_balance))
      total_balance = total_balance.plus(BN(lockup.total_balance))
      unclaimed_balance = unclaimed_balance.plus(BN(lockup.unclaimed_balance))
    })

    return { claimed_balance, total_balance, unclaimed_balance }
  })
}
