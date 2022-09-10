import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'
import { AccountBalance } from 'near-api-js/lib/account'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/contracts/MultiSig'

interface FetchContractResult {
  balance: AccountBalance
  num_confirmations: number
  request_ids: number[]
}

const fetchContract = createAsyncThunk<
  FetchContractResult,
  string,
  {
    rejectValue: Error
  }
>('chain/fetchContract', async (contractId, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(contractId)
  const contract = getContract(account, contractId)

  try {
    const [balance, num_confirmations, request_ids] = await Promise.all([
      account.getAccountBalance(),
      contract.get_num_confirmations(),
      contract.list_request_ids(),
    ])
    return { balance, num_confirmations, request_ids }
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export default fetchContract
