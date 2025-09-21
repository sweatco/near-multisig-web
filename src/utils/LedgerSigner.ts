import { Signer } from '@near-js/signers'
import { PublicKey, KeyPair, KeyType } from '@near-js/crypto'
import { encodeTransaction, SignedTransaction, Signature } from '@near-js/transactions'
import { sha256 } from '@noble/hashes/sha256'
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
    await this.getPublicKey(accountId, networkId)
    const signatureData = await this.ledgerManager.sign(message, this.path)

    return new Signature({
      keyType: KeyType.ED25519,
      data: signatureData
    })
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

  async signTransaction(transaction: any): Promise<[Uint8Array, SignedTransaction]> {
    const publicKey = await this.getPublicKey()

    // Validate public key matches
    if (transaction.publicKey.toString() !== publicKey.toString()) {
      throw new Error("The public key doesn't match the signer's key")
    }

    // 1. Encode transaction to bytes
    const message = encodeTransaction(transaction)

    // 2. Hash the encoded transaction
    const hash = new Uint8Array(sha256(message))

    // 3. Sign the hash with Ledger
    const signatureData = await this.ledgerManager.sign(hash, this.path)

    // 4. Create signature object
    const signature = new Signature({
      keyType: KeyType.ED25519,
      data: signatureData
    })

    // 5. Create signed transaction
    const signedTx = new SignedTransaction({
      transaction,
      signature
    })

    return [hash, signedTx]
  }

  toString(): string {
    return `LedgerSigner()`
  }
}
