import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getSigner } from '../../utils/chainHelpers'
import { parseTgas } from '../../utils/formatBalance'
import LedgerManager from '../../utils/LedgerManager'
import { getTransactionLastResult } from 'near-api-js/lib/providers'

interface ConfirmRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  contractId: string
  requestId: number
}

interface ConfirmRequestResult {
  value: boolean | string
  txHash: string
}

const confirmRequest = createAsyncThunk<
  ConfirmRequestResult,
  ConfirmRequestArgs,
  {
    rejectValue: Error
  }
>('chain/confirmRequest', async ({ key, ledgerManager, contractId, requestId }, { rejectWithValue }) => {
  try {
    const near = await nearAPI.connect({ ...DefaultNet, ...getSigner(contractId, key, ledgerManager) })
    const account = await near.account(contractId)

    const rawResult = await account.functionCall({
      contractId: contractId,
      methodName: 'confirm',
      args: { request_id: requestId },
      gas: parseTgas(250),
    })

    const value = getTransactionLastResult(rawResult)
    const txHash = rawResult.transaction_outcome.id

    return { value, txHash }
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export default confirmRequest
