import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'

const fetchContractRequestList = createAsyncThunk<
  number[],
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/fetchContractRequestList', async (contractId, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(contractId)
  const contract = getContract(account, contractId)

  try {
    return contract.list_request_ids()
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchContractRequestList
