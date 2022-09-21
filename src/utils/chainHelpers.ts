import * as nearAPI from 'near-api-js'
import { parseSeedPhrase } from 'near-seed-phrase'
import LedgerManager from './LedgerManager'
import { LedgerSigner } from './LedgerSigner'
import { DefaultNet } from './networks'

export function parseKey(key: string) {
  if (key.split(' ').length > 1) {
    // Seed Phrase
    const { secretKey } = parseSeedPhrase(key)
    return nearAPI.KeyPair.fromString(secretKey)
  } else {
    // Private Key
    return nearAPI.KeyPair.fromString(key)
  }
}

export function getSigner(accountId: string, key?: string, ledgerManager?: LedgerManager, ledgerPath?: string) {
  if (key) {
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
    const keyPair = parseKey(key)
    keyStore.setKey(DefaultNet.networkId, accountId, keyPair)
    return { keyStore }
  } else if (ledgerManager) {
    const signer = new LedgerSigner(ledgerManager, ledgerPath)
    return { signer }
  } else {
    return {}
  }
}
