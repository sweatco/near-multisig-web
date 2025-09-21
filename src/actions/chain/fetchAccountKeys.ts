import { createAsyncThunk } from '@reduxjs/toolkit'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'
import { AccessKeyInfoView } from '@near-js/types'

const fetchAccountKeys = createAsyncThunk<
  AccessKeyInfoView[],
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/fetchAccountKeys', async (accountId, { rejectWithValue }) => {
  const account = createAccountWithSigner(accountId)

  try {
    return account.getAccessKeys()
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchAccountKeys
