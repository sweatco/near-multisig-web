import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { MultiSigRequest } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson, getSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'
import { SignAndSendTransactionOptions } from 'near-api-js/lib/account'
import { FinalExecutionOutcome, getTransactionLastResult } from 'near-api-js/lib/providers'

interface AddRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
  accountId: string
  request: MultiSigRequest
  tgas?: number
}

export interface AddRequestResult {
  value: any
  txHash: string
  transaction: any
}

const sendTransaction = createAsyncThunk<
  AddRequestResult,
  AddRequestArgs,
  {
    rejectValue: ErrorObject
  }
>('chain/sendTransaction', async ({ key, ledgerManager, ledgerPath, accountId, request }, { rejectWithValue }) => {
  try {
    const near = await nearAPI.connect({ ...DefaultNet, ...getSigner(accountId, key, ledgerManager, ledgerPath) })
    const account = await near.account(accountId)

    const rawResult: FinalExecutionOutcome = await (account as any).signAndSendTransaction({
      receiverId: request.receiver_id,
      actions: request.actions,
      returnError: true,
    } as SignAndSendTransactionOptions)

    const value = getTransactionLastResult(rawResult)
    const txHash = rawResult.transaction_outcome.id

    return { value, txHash, transaction: rawResult.transaction }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default sendTransaction
