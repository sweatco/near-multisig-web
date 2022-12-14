import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'
import { AccountBalance } from 'near-api-js/lib/account'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'

interface FetchContractResult {
  balance?: AccountBalance
  num_confirmations?: number
}

const fetchContract = createAsyncThunk<
  FetchContractResult,
  string,
  {
    rejectValue: ErrorObject
  }
>('chain/fetchContract', async (contractId, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(contractId)
  const contract = getContract(account, contractId)

  try {
    const [balance, num_confirmations] = await Promise.all([
      account.getAccountBalance().catch(() => undefined),
      contract.get_num_confirmations().catch(() => undefined),
    ])
    return { balance, num_confirmations }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchContract
