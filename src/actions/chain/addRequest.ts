import { createAsyncThunk } from '@reduxjs/toolkit'

import { MultiSigRequest } from '../../utils/contracts/MultiSig'
import { parseTgas } from '../../utils/formatBalance'
import { ErrorObject, errorToJson, createAccountWithSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'
import { SignAndSendTransactionOptions } from '@near-js/accounts'
import { actionCreators } from '@near-js/transactions'
import { FinalExecutionOutcome } from '@near-js/types'
import { getTransactionLastResult } from '@near-js/utils'

interface AddRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
  contractId: string
  request: MultiSigRequest
  tgas?: number
}

export interface AddRequestResult {
  value: any
  txHash: string
  transaction: any
}

const addRequest = createAsyncThunk<
  AddRequestResult,
  AddRequestArgs,
  {
    rejectValue: ErrorObject
  }
>('chain/addRequest', async ({ key, ledgerManager, ledgerPath, contractId, request, tgas }, { rejectWithValue }) => {
  try {
    const account = createAccountWithSigner(contractId, key, ledgerManager, ledgerPath)

    const accessKeys = await account.getAccessKeys()
    const accessKeyInfo = accessKeys.find(ak => {
      if (ak.access_key.permission === 'FullAccess') {
        return true
      }
      // Check if it's a function call permission
      if (typeof ak.access_key.permission === 'object' && ak.access_key.permission.FunctionCall) {
        return ak.access_key.permission.FunctionCall.receiver_id === contractId
      }
      return false
    })

    if (accessKeyInfo?.access_key.permission === 'FullAccess') {
      const rawResult: FinalExecutionOutcome = await account.signAndSendTransaction({
        receiverId: request.receiver_id,
        actions: request.actions.map((action) => {
          switch (action.type) {
            case 'FunctionCall':
              return actionCreators.functionCall(
                action.method_name,
                Buffer.from(action.args, 'base64'),
                BigInt(action.gas),
                BigInt(action.deposit)
              )
            case 'Transfer':
              return actionCreators.transfer(BigInt(action.amount))
          }

          return null
        }),
        returnError: true,
      } as SignAndSendTransactionOptions)

      const value = getTransactionLastResult(rawResult)
      const txHash = rawResult.transaction_outcome.id

      return { value, txHash, transaction: rawResult.transaction }
    } else {
      const rawResult = await account.functionCall({
        contractId: contractId,
        methodName: (typeof accessKeyInfo?.access_key.permission === 'object' &&
                    accessKeyInfo.access_key.permission.FunctionCall?.method_names?.includes('add_request_and_confirm'))
          ? 'add_request_and_confirm'
          : 'add_request',
        args: { request: request },
        gas: tgas ? BigInt(parseTgas(300)!) : undefined,
      })

      const value = getTransactionLastResult(rawResult)
      const txHash = rawResult.transaction_outcome.id

      return { value, txHash, transaction: rawResult.transaction }
    }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default addRequest
