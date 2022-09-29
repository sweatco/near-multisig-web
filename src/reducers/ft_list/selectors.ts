import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'

import ftListSlice from './reducer'

export const getFTListSlice = (state: RootState) => state[ftListSlice.name]

export const getFTList = (state: RootState) => getFTListSlice(state).list
export const getFTLockups = (state: RootState) => getFTListSlice(state).lockups

export const makeFTListSelector = () => {
  const getContractId = (_: any, contractId: string) => contractId
  return createSelector(getFTList, getContractId, (listState, contractId) => {
    return listState[contractId] ?? []
  })
}

export const makeLockupListSelector = () => {
  const getContractId = (_: any, contractId: string) => contractId
  const getTokenId = (_: any, __: any, tokenId: string) => tokenId
  return createSelector(getFTLockups, getContractId, getTokenId, (lockups, contractId, tokenId) => {
    return (lockups[contractId] ?? {})[tokenId] ?? []
  })
}

export const makeGetLockupTokenIdSelector = () => {
  const getContractId = (_: any, contractId: string) => contractId
  const getLockupId = (_: any, __: any, lockupId: string) => lockupId

  return createSelector(getFTLockups, getContractId, getLockupId, (lockups, contractId, lockupId) => {
    const contract = lockups[contractId] ?? {}
    return Object.keys(contract).find((tokenId) => {
      return contract[tokenId].includes(lockupId)
    })
  })
}
