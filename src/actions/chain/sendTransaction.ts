import { createAsyncThunk } from '@reduxjs/toolkit'
import { MultiSigRequest } from '../../utils/contracts/MultiSig'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'
import { SignAndSendTransactionOptions } from '@near-js/accounts'
import { FinalExecutionOutcome } from '@near-js/types'
import { getTransactionLastResult } from '@near-js/utils'

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
    const account = createAccountWithSigner(accountId, key, ledgerManager, ledgerPath)

    const rawResult: FinalExecutionOutcome = await account.signAndSendTransaction({
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
