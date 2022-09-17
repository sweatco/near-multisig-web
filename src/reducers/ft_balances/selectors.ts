import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'

import ftBalancesSlice from './reducer'

export const getFTBalancesSlice = (state: RootState) => state[ftBalancesSlice.name]

export const getFTBalances = (state: RootState) => getFTBalancesSlice(state).balances

export const getRequests = (state: RootState) => getFTBalancesSlice(state).requests

export const getAccountBalances = (state: RootState, accountId: string) => {
  const balances = getFTBalances(state)
  return balances[accountId]
}

export const makeAccountBalanceSelector = () => {
  const getAccountId = (_: any, accountId: string) => accountId
  const getTokenId = (_: any, __: any, tokenId: string) => tokenId
  const accountSelector = createSelector(getFTBalances, getAccountId, (accounts, accountId) => {
    return accounts[accountId]
  })

  return createSelector(accountSelector, getTokenId, (balances, tokenId) => {
    if (balances) {
      return balances.find((balance) => balance.tokenId === tokenId)
    }
  })
}
