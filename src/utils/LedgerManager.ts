import { createClient, getSupportedTransport, setDebugLogging } from 'near-ledger-js'
import { listen } from '@ledgerhq/logs'
import { PublicKey } from 'near-api-js/lib/utils'
import { KeyType } from 'near-api-js/lib/utils/key_pair'

setDebugLogging(true)
listen(console.log)

class LedgerManager {
  connected: boolean

  private connectionPromise?: Promise<void>
  private transport: any
  private client: any
  private readonly disconnectHandler: (reason: string) => void

  constructor() {
    this.connected = false
    this.disconnectHandler = (...args) => this.handleDisconnect(...args)
  }

  async connect() {
    if (this.connected) {
      return
    }

    if (this.connectionPromise) {
      await this.connectionPromise
      return
    }

    console.info('connect() Connecting...')
    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        this.transport = await getSupportedTransport()
        this.transport.setScrambleKey('NEAR')
        this.transport.on('disconnect', this.disconnectHandler)

        this.client = await createClient(this.transport)
        this.connected = true

        console.info('connect() Connected', this.client)

        resolve()
      } catch (err) {
        reject(err)
      }
    })

    try {
      await this.connectionPromise
    } catch (err) {
      throw err
    } finally {
      delete this.connectionPromise
    }
  }

  async disconnect() {
    if (this.connectionPromise) {
      await this.connectionPromise
    }

    if (this.transport) {
      if (this.transport.close) {
        try {
          console.info('disconnect() Closing transport...')
          this.transport.close()
        } catch (e) {
          console.warn('Failed to close existing transport', e)
        } finally {
          this.transport.off('disconnect', this.disconnectHandler)
        }
      }

      delete this.transport
      delete this.client
      this.connected = false
    }
  }

  handleDisconnect(reason: string) {
    console.info('Ledger disconnected', reason)
  }

  async getVersion() {
    await this.connect()
    return (await this.client.getVersion()) as string
  }

  async getPublicKey(path?: string) {
    await this.connect()
    const pkData = (await this.client.getPublicKey(path)) as Buffer
    return new PublicKey({ keyType: KeyType.ED25519, data: pkData })
  }

  async sign(transactionData: any, path?: string) {
    await this.connect()
    return this.client.sign(transactionData, path) as Buffer
  }
}

export const ledgerManager = new LedgerManager()

export default LedgerManager
