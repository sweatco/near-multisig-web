import * as nearAPI from 'near-api-js'
import { ErrorContext } from 'near-api-js/lib/providers'
import { parseSeedPhrase } from 'near-seed-phrase'
import LedgerManager from './LedgerManager'
import { LedgerSigner } from './LedgerSigner'
import { DefaultNet } from './networks'

export interface ErrorObject {
  message?: string
  type?: string
  context?: ErrorContext
  kind?: any
}

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

export function getSigner(accountId: string, key?: string, ledgerManager?: LedgerManager, ledgerPath?: number) {
  if (key) {
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
    const keyPair = parseKey(key)
    keyStore.setKey(DefaultNet.networkId, accountId, keyPair)
    return { keyStore }
  } else if (ledgerManager) {
    const signer = new LedgerSigner(ledgerManager, deriveLedgerPath(ledgerPath))
    return { signer }
  } else {
    return {}
  }
}

export function deriveLedgerPath(pathComponent?: number) {
  return `44'/397'/0'/0'/${pathComponent ?? 1}'`
}

export function errorToJson(err: any): ErrorObject {
  return {
    message: err.message ?? 'Unknown error',
    ...(err.type ? { type: err.type } : {}),
    ...(err.context ? { context: err.context } : {}),
    ...(err.kind ? { kind: err.kind } : {}),
  }
}

export function errorToMessage(err: ErrorObject | Error) {
  return ('kind' in err ? err.kind.ExecutionError : undefined) ?? err.message ?? 'Unknown error'
}
