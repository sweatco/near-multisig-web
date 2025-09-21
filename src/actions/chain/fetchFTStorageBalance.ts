import { createAsyncThunk } from '@reduxjs/toolkit'
import { getContract } from '../../utils/contracts/FungibleToken'
import { RootState } from '../../reducers'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'

export interface FetchFTBalanceArgs {
  tokenId: string
  accountId: string
}

const fetchFTStorageBalance = createAsyncThunk<
  boolean,
  FetchFTBalanceArgs,
  {
    state: RootState
    rejectValue: ErrorObject
  }
>('chain/fetchFTStorageBalance', async ({ tokenId, accountId }, { rejectWithValue }) => {
  const account = createAccountWithSigner(tokenId)
  const contract = getContract(account, tokenId)

  try {
    const balance = await contract.storage_balance_of({ account_id: accountId })
    return balance != null
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchFTStorageBalance
