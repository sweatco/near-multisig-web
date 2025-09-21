import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../reducers'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'
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
  const account = createAccountWithSigner(contractId)
  const contract = getContract(account, lockupId)

  try {
    return await contract.get_account_lockups({ account_id: contractId })
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchLockup
