import { createAsyncThunk } from '@reduxjs/toolkit'
import { getContract } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'
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
    rejectValue: ErrorObject
  }
>('chain/deleteRequest', async ({ key, ledgerManager, ledgerPath, contractId, requestId }, { rejectWithValue }) => {
  try {
    const account = createAccountWithSigner(contractId, key, ledgerManager, ledgerPath)
    const contract = getContract(account, contractId)

    return await contract.delete_request({ request_id: requestId })
  } catch (err: any) {
    return rejectWithValue(errorToJson(err))
  }
})

export default deleteRequest
