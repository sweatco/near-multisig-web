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

    // Get the public key of the signer being used
    const signerPublicKey = await account.getSigner()!.getPublicKey()

    // Get access key info for the specific key that will be used for signing
    const accessKeyInfo = await account.getAccessKey(signerPublicKey)

    if (accessKeyInfo?.permission === 'FullAccess') {
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
        methodName:
          typeof accessKeyInfo?.permission === 'object' &&
          accessKeyInfo.permission.FunctionCall?.method_names?.includes('add_request_and_confirm')
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
