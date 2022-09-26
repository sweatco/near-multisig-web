import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract, MultiSigRequest } from '../../utils/contracts/MultiSig'
import { parseTgas } from '../../utils/formatBalance'
import { ErrorObject, errorToJson, getSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'

interface AddRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  ledgerPath?: number
  contractId: string
  request: MultiSigRequest
  tgas?: number
}

type AddRequestResult = number

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
    const contract = getContract(account, contractId)

    const accessKeyInfo = await account.findAccessKey(contractId, [])

    if (
      accessKeyInfo?.accessKey.permission === 'FullAccess' ||
      accessKeyInfo?.accessKey.permission.FunctionCall.method_names?.includes('add_request_and_confirm')
    ) {
      return await contract.add_request_and_confirm({ request: request }, tgas ? parseTgas(tgas) : undefined)
    } else {
      return await contract.add_request({ request: request }, tgas ? parseTgas(tgas) : undefined)
    }
  } catch (err) {
    return rejectWithValue(errorToJson(err))
  }
})

export default addRequest
