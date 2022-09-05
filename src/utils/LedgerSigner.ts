import { Signer } from 'near-api-js'
import { PublicKey, KeyPair, Signature } from 'near-api-js/lib/utils/key_pair'
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
    const signature = await this.ledgerManager.sign(message)
    return { signature, publicKey }
  }

  toString(): string {
    return `LedgerSigner()`
  }
}
