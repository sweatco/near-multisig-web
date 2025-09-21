import { KeyPairSigner } from '@near-js/signers'
import { ErrorContext } from '@near-js/types'
import { parseSeedPhrase } from 'near-seed-phrase'
import LedgerManager from './LedgerManager'
import { LedgerSigner } from './LedgerSigner'
import { createAccount } from './networks'
import { KeyPairString } from '@near-js/crypto'

export interface ErrorObject {
  message?: string
  type?: string
  context?: ErrorContext
  kind?: any
}

export function createSignerFromKey(key: string) {
  if (key.split(' ').length > 1) {
    // Seed Phrase
    const { secretKey } = parseSeedPhrase(key)
    return KeyPairSigner.fromSecretKey(secretKey as KeyPairString)
  } else {
    // Private Key - needs proper KeyPairString type
    return KeyPairSigner.fromSecretKey(key as KeyPairString)
  }
}

export function getSigner(key?: string, ledgerManager?: LedgerManager, ledgerPath?: number) {
  if (key) {
    return { signer: createSignerFromKey(key) }
  } else if (ledgerManager) {
    const signer = new LedgerSigner(ledgerManager, deriveLedgerPath(ledgerPath))
    return { signer }
  } else {
    return {}
  }
}

// New v6.x account creation function
export function createAccountWithSigner(
  accountId: string,
  key?: string,
  ledgerManager?: LedgerManager,
  ledgerPath?: number
) {
  if (key) {
    const signer = createSignerFromKey(key)
    return createAccount(accountId, signer)
  } else if (ledgerManager) {
    const signer = new LedgerSigner(ledgerManager, deriveLedgerPath(ledgerPath))
    return createAccount(accountId, signer)
  } else {
    // View-only account
    return createAccount(accountId)
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
