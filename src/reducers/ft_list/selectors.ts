import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'

import ftListSlice from './reducer'

export const getFTListSlice = (state: RootState) => state[ftListSlice.name]

export const getFTList = (state: RootState) => getFTListSlice(state).ftList

export const makeFTListSelector = () => {
  const getContractId = (_: any, contractId: string) => contractId
  return createSelector(getFTList, getContractId, (listState, contractId) => {
    const ftList: string[] = []
    Object.entries(listState).forEach(([tokenId, contractList]) => {
      if (contractList.includes(contractId)) {
        ftList.push(tokenId)
      }
    })
    return ftList
  })
}
