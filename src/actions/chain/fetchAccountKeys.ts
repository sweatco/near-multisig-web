import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'
import { AccessKeyInfoView } from 'near-api-js/lib/providers/provider'

const fetchAccountKeys = createAsyncThunk<
  AccessKeyInfoView[],
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/fetchAccountKeys', async (accountId, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(accountId)

  try {
    return account.getAccessKeys()
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchAccountKeys
