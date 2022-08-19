import * as nearAPI from 'near-api-js'
import { parseSeedPhrase } from 'near-seed-phrase'

import { getContract } from '../utils/MultiSigContract'
import { TestNet } from '../utils/networks'

const useSignRequest = (contractId: string, requestId: number) => {
  return sign

  async function sign(key: string) {
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
    const { keyPair, accountId = contractId } = parseKey(key)
    keyStore.setKey(TestNet.networkId, accountId, keyPair)

    const near = await nearAPI.connect({ ...TestNet, keyStore })
    const account = await near.account(accountId)
    const contract = getContract(account, contractId)

    const result = await contract.confirm({ request_id: requestId })
    return typeof result === 'string' ? true : result
  }

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
}

export default useSignRequest
