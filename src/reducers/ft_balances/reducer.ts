import { createSlice } from '@reduxjs/toolkit'
import fetchFTBalance, { FetchFTBalanceArgs } from '../../actions/chain/fetchFTBalance'

interface FTBalance {
  tokenId: string
  balance: string
}

interface FTBalanceRequest {
  arg: FetchFTBalanceArgs
  requestId: string
  requestStatus: string
}

interface FTBalancesState {
  balances: {
    [accountId: string]: FTBalance[]
  }
  requests: FTBalanceRequest[]
}

export const ftBalancesSlice = createSlice({
  name: 'ft_balances',
  initialState: { balances: {}, requests: [] } as FTBalancesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFTBalance.pending, (state, action) => {
        state.requests.push(action.meta)
      })
      .addCase(fetchFTBalance.fulfilled, (state, action) => {
        const { accountId, tokenId } = action.meta.arg

        state.requests = state.requests.filter((request) => request.requestId !== action.meta.requestId)

        state.balances[accountId] = state.balances[accountId] ?? []
        const balance = state.balances[accountId].find((value) => value.tokenId === tokenId)
        if (balance) {
          balance.balance = action.payload
        } else {
          state.balances[accountId].push({
            tokenId: tokenId,
            balance: action.payload,
          })
        }
      })
      .addCase(fetchFTBalance.rejected, (state, action) => {
        state.requests.filter((request) => request.requestId !== action.meta.requestId)
      })
  },
})

export const ftBalancesActions = ftBalancesSlice.actions
export default ftBalancesSlice
