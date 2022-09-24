import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/contracts/MultiSig'
import { getSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'

interface DeleteRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
  contractId: string
  requestId: number
}

const deleteRequest = createAsyncThunk<
  string,
  DeleteRequestArgs,
  {
    rejectValue: Error
  }
>('chain/deleteRequest', async ({ key, ledgerManager, ledgerPath, contractId, requestId }, { rejectWithValue }) => {
  try {
    const near = await nearAPI.connect({ ...DefaultNet, ...getSigner(contractId, key, ledgerManager, ledgerPath) })
    const account = await near.account(contractId)
    const contract = getContract(account, contractId)

    return await contract.delete_request({ request_id: requestId })
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export default deleteRequest
