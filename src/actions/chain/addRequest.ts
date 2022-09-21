import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract, MultiSigRequest } from '../../utils/contracts/MultiSig'
import { parseTgas } from '../../utils/formatBalance'
import { getSigner } from '../../utils/chainHelpers'
import LedgerManager from '../../utils/LedgerManager'

interface AddRequestArgs {
  key?: string
  ledgerManager?: LedgerManager
  contractId: string
  request: MultiSigRequest
  tgas?: number
}

type AddRequestResult = number

const addRequest = createAsyncThunk<
  AddRequestResult,
  AddRequestArgs,
  {
    rejectValue: Error
  }
>('chain/addRequest', async ({ key, ledgerManager, contractId, request, tgas }, { rejectWithValue }) => {
  try {
    const near = await nearAPI.connect({ ...DefaultNet, ...getSigner(contractId, key, ledgerManager) })
    const account = await near.account(contractId)
    const contract = getContract(account, contractId)

    return await contract.add_request_and_confirm({ request: request }, tgas ? parseTgas(tgas) : undefined)
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export default addRequest
