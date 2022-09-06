import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract } from '../../utils/MultiSigContract'
import { LedgerSigner } from '../../utils/LedgerSigner'
import LedgerManager from '../../utils/LedgerManager'

interface ConfirmRequestArgs {
  ledgerManager: LedgerManager
  contractId: string
  requestId: number
}

type ConfirmRequestResult = boolean | string

const confirmRequestWithLedger = createAsyncThunk<
  ConfirmRequestResult,
  ConfirmRequestArgs,
  {
    rejectValue: Error
  }
>('chain/confirmRequest', async ({ ledgerManager, contractId, requestId }, { rejectWithValue }) => {
  const signer = new LedgerSigner(ledgerManager)

  try {
    const near = await nearAPI.connect({ ...DefaultNet, signer })
    const account = await near.account(contractId)
    const contract = getContract(account, contractId)

    return await contract.confirm({ request_id: requestId })
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export default confirmRequestWithLedger
