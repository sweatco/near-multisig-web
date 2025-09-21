import { createAsyncThunk } from '@reduxjs/toolkit'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'
import { parseTgas } from '../../utils/formatBalance'
import LedgerManager from '../../utils/LedgerManager'
import { getTransactionLastResult } from '@near-js/utils'

interface ConfirmRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
  contractId: string
  requestId: number
}

export interface ConfirmRequestResult {
  value: string | number | object | null | boolean
  txHash: string
}

const confirmRequest = createAsyncThunk<
  ConfirmRequestResult,
  ConfirmRequestArgs,
  {
    rejectValue: ErrorObject
  }
>('chain/confirmRequest', async ({ key, ledgerManager, ledgerPath, contractId, requestId }, { rejectWithValue }) => {
  try {
    const account = createAccountWithSigner(contractId, key, ledgerManager, ledgerPath)

    const rawResult = await account.functionCall({
      contractId: contractId,
      methodName: 'confirm',
      args: { request_id: requestId },
      gas: BigInt(parseTgas(300)!),
    })

    const value = getTransactionLastResult(rawResult)
    const txHash = rawResult.transaction_outcome.id

    return { value, txHash }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default confirmRequest
