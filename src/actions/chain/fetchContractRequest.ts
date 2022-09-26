import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract, MultiSigRequest } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'

interface FetchContractRequestArgs {
  contractId: string
  requestId: number
}

interface FetchContractRequestResult {
  request: MultiSigRequest
  confirmations: string[]
}

const fetchContractRequest = createAsyncThunk<
  FetchContractRequestResult,
  FetchContractRequestArgs,
  {
    rejectValue: ErrorObject
  }
>('chain/fetchContractRequest', async ({ contractId, requestId }, { rejectWithValue }) => {
  const near = await nearAPI.connect(DefaultNet)
  const account = await near.account(contractId)
  const contract = getContract(account, contractId)

  try {
    const [request, confirmations] = await Promise.all([
      contract.get_request({ request_id: requestId }),
      contract.get_confirmations({ request_id: requestId }),
    ])
    return { request, confirmations }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default fetchContractRequest
