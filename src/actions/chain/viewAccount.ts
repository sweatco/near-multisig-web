import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { AccountView } from 'near-api-js/lib/providers/provider'
import { ServerError } from 'near-api-js/lib/utils/rpc_errors'

interface RejectType {
  type: string
  message: string
}

const viewAccount = createAsyncThunk<
  AccountView,
  string,
  {
    rejectValue: RejectType
  }
>('chain/viewAccount', async (accountId, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(accountId)

  try {
    return await account.state()
  } catch (err) {
    const serverError = err as ServerError
    return rejectWithValue({
      type: serverError.type,
      message: serverError.message,
    })
  }
})

export default viewAccount
