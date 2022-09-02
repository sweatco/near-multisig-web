import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'
import { parseSeedPhrase } from 'near-seed-phrase'

import { TestNet } from '../../utils/networks'
import { getContract } from '../../utils/MultiSigContract'

interface ConfirmRequestArgs {
  key: string
  contractId: string
  requestId: number
}

type ConfirmRequestResult = boolean | string

const confirmRequest = createAsyncThunk<
  ConfirmRequestResult,
  ConfirmRequestArgs,
  {
    rejectValue: Error
  }
>('chain/confirmRequest', async ({ key, contractId, requestId }, { rejectWithValue }) => {
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
  const { keyPair, accountId = contractId } = parseKey(key)
  keyStore.setKey(TestNet.networkId, accountId, keyPair)

  try {
    const near = await nearAPI.connect({ ...TestNet, keyStore })
    const account = await near.account(accountId)
    const contract = getContract(account, contractId)

    return await contract.confirm({ request_id: requestId })
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

function parseKey(key: string) {
  if (key.split(' ').length > 1) {
    // Seed Phrase
    const { secretKey } = parseSeedPhrase(key)
    return { keyPair: nearAPI.KeyPair.fromString(secretKey) }
  } else if (key.split('/').length > 1) {
    // With Account Id
    return { accountId: key.split('/')[0], keyPair: nearAPI.KeyPair.fromString(key.split('/')[1]) }
  } else {
    // Private Key
    return { keyPair: nearAPI.KeyPair.fromString(key) }
  }
}

export default confirmRequest
