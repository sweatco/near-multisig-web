import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/contracts/FungibleToken'
import { RootState } from '../../reducers'

export interface FetchFTBalanceArgs {
  tokenId: string
  accountId: string
}

const fetchFTStorageBalance = createAsyncThunk<
  boolean,
  FetchFTBalanceArgs,
  {
    state: RootState
    rejectValue: Error
  }
>('chain/fetchFTStorageBalance', async ({ tokenId, accountId }, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(tokenId)
  const contract = getContract(account, tokenId)

  try {
    const balance = await contract.storage_balance_of({ account_id: accountId })
    return balance != null
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export default fetchFTStorageBalance
