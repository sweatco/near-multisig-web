import { createAsyncThunk } from '@reduxjs/toolkit'
import { AccountBalance } from '@near-js/accounts'
import { getContract } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'

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
  const account = createAccountWithSigner(contractId)
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
