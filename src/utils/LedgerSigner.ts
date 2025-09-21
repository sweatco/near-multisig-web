import { Signer } from '@near-js/signers'
import { PublicKey, KeyPair, Signature } from '@near-js/crypto'
import LedgerManager from './LedgerManager'

export class LedgerSigner extends Signer {
  private ledgerManager: LedgerManager
  private publicKey?: PublicKey
  private path?: string

  constructor(ledgerManager: LedgerManager, path?: string) {
    super()
    this.ledgerManager = ledgerManager
    this.path = path
  }

  async createKey(accountId: string, networkId: string): Promise<PublicKey> {
    const keyPair = KeyPair.fromRandom('ed25519')
    return keyPair.getPublicKey()
  }

  async getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey> {
    if (!this.publicKey) {
      this.publicKey = await this.ledgerManager.getPublicKey(this.path)
    }
    return this.publicKey
  }

  async signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature> {
    const publicKey = await this.getPublicKey(accountId, networkId)
    const signature = (await this.ledgerManager.sign(message, this.path)) as any
    return { signature, publicKey }
  }

  async signDelegateAction(_delegateAction: any): Promise<[Uint8Array, any]> {
    // For now, delegate actions are not supported on Ledger
    throw new Error('Delegate actions are not supported with Ledger signer')
  }

  async signNep413Message(
    _message: string,
    _accountId: string,
    _recipient: string,
    _nonce: Uint8Array,
    _callbackUrl?: string
  ): Promise<any> {
    // For now, NEP-413 messages are not supported on Ledger
    throw new Error('NEP-413 messages are not supported with Ledger signer')
  }

  async signTransaction(_transaction: any): Promise<[Uint8Array, any]> {
    // For now, direct transaction signing is not supported on Ledger in this implementation
    throw new Error('Direct transaction signing is not supported with this Ledger signer implementation')
  }

  toString(): string {
    return `LedgerSigner()`
  }
}
