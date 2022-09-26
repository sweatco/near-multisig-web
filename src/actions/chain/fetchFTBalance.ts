import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/contracts/FungibleToken'
import { RootState } from '../../reducers'
import { ftBalancesSelectors } from '../../reducers/ft_balances'
import { shallowEqual } from 'react-redux'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'

export interface FetchFTBalanceArgs {
  tokenId: string
  accountId: string
  force?: boolean
}

const accountBalanceSelector = ftBalancesSelectors.makeAccountBalanceSelector()

const fetchFTBalance = createAsyncThunk<
  string,
  FetchFTBalanceArgs,
  {
    state: RootState
    rejectValue: ErrorObject
  }
>(
  'chain/fetchFTBalance',
  async ({ tokenId, accountId }, { rejectWithValue }) => {
    const near = await nearAPI.connect(DefaultNet)
    const account = await near.account(tokenId)
    const contract = getContract(account, tokenId)

    try {
      return await contract.ft_balance_of({ account_id: accountId })
    } catch (err) {
      return rejectWithValue(errorToJson(err))
    }
  },
  {
    condition: (arg, { getState }) => {
      const { accountId, tokenId, force = false } = arg
      const state = getState()

      // Check if we have similar request going
      const requests = ftBalancesSelectors.getRequests(state)
      for (const request of requests) {
        if (shallowEqual(request.arg, arg)) {
          return false
        }
      }

      // Check if we already have fetched balance and don't need it to be re-fetched
      const balance = accountBalanceSelector(state, accountId, tokenId)
      if (balance && !force) {
        return false
      }
    },
  }
)

export default fetchFTBalance
