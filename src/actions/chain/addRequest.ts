import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'
import BN from 'bn.js'

import { DefaultNet } from '../../utils/networks'
import { MultiSigRequest } from '../../utils/contracts/MultiSig'
import { parseTgas } from '../../utils/formatBalance'
import { ErrorObject, errorToJson, getSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'
import { SignAndSendTransactionOptions } from 'near-api-js/lib/account'
import { transactions } from 'near-api-js'
import { FinalExecutionOutcome, getTransactionLastResult } from 'near-api-js/lib/providers'

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
    const near = await nearAPI.connect({ ...DefaultNet, ...getSigner(contractId, key, ledgerManager, ledgerPath) })
    const account = await near.account(contractId)

    const accessKeyInfo = await account.findAccessKey(contractId, [])

    if (accessKeyInfo?.accessKey.permission === 'FullAccess') {
      const rawResult: FinalExecutionOutcome = await (account as any).signAndSendTransaction({
        receiverId: request.receiver_id,
        actions: request.actions.map((action) => {
          switch (action.type) {
            case 'FunctionCall':
              return transactions.functionCall(
                action.method_name,
                Buffer.from(action.args, 'base64'),
                new BN(action.gas),
                new BN(action.deposit)
              )
            case 'Transfer':
              return transactions.transfer(new BN(action.amount))
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
        methodName: accessKeyInfo?.accessKey.permission.FunctionCall.method_names?.includes('add_request_and_confirm')
          ? 'add_request_and_confirm'
          : 'add_request',
        args: { request: request },
        gas: tgas ? new BN(parseTgas(300)!) : undefined,
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
