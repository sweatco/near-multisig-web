import { ConnectConfig, keyStores } from 'near-api-js'

const keyStore = new keyStores.InMemoryKeyStore()

export const TestNet: ConnectConfig = {
  keyStore,
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  headers: {},
}

export const MainNet: ConnectConfig = {
  keyStore,
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  headers: {},
}
