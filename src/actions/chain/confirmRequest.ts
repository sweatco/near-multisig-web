import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'
import BN from 'bn.js'

import { DefaultNet } from '../../utils/networks'
import { ErrorObject, errorToJson, getSigner } from '../../utils/chainHelpers'
import { parseTgas } from '../../utils/formatBalance'
import LedgerManager from '../../utils/LedgerManager'
import { getTransactionLastResult } from 'near-api-js/lib/providers'

interface ConfirmRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
  contractId: string
  requestId: number
}

export interface ConfirmRequestResult {
  value: boolean | string
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
    const near = await nearAPI.connect({ ...DefaultNet, ...getSigner(contractId, key, ledgerManager, ledgerPath) })
    const account = await near.account(contractId)

    const rawResult = await account.functionCall({
      contractId: contractId,
      methodName: 'confirm',
      args: { request_id: requestId },
      gas: new BN(parseTgas(300)!),
    })

    const value = getTransactionLastResult(rawResult)
    const txHash = rawResult.transaction_outcome.id

    return { value, txHash }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default confirmRequest
