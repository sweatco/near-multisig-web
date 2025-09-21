import { createAsyncThunk } from '@reduxjs/toolkit'
import { AccountView } from '@near-js/types'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'

const viewAccount = createAsyncThunk<
  AccountView,
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/viewAccount', async (accountId, { rejectWithValue }) => {
  const account = createAccountWithSigner(accountId)

  try {
    return await account.state()
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default viewAccount
