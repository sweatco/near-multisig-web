import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { RootState } from '../../reducers'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'
import { getContract, LockupEntry } from '../../utils/contracts/Lockup'

interface FetchLockupArgs {
  contractId: string
  tokenId: string
  lockupId: string
}

const fetchLockup = createAsyncThunk<
  LockupEntry[],
  FetchLockupArgs,
  {
    state: RootState
    rejectValue: ErrorObject
  }
>('chain/fetchLockup', async ({ contractId, lockupId }, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(contractId)
  const contract = getContract(account, lockupId)

  try {
    return await contract.get_account_lockups({ account_id: contractId })
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchLockup
