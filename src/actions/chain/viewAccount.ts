import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { AccountView } from 'near-api-js/lib/providers/provider'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'

const viewAccount = createAsyncThunk<
  AccountView,
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/viewAccount', async (accountId, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(accountId)

  try {
    return await account.state()
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default viewAccount
