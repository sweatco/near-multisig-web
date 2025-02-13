import { ConnectConfig, keyStores } from 'near-api-js'

const keyStore = new keyStores.InMemoryKeyStore()

interface NetworkConfig extends ConnectConfig {
  explorerUrl: string
}

export const TestNet: NetworkConfig = {
  keyStore,
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'http://explorer.testnet.near.org',
  headers: {},
}

export const MainNet: NetworkConfig = {
  keyStore,
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'http://explorer.near.org',
  headers: {},
}

export const DefaultNet = process.env.NODE_ENV === 'production' ? MainNet : TestNet

export const isMainNet = function () {
  return DefaultNet.networkId === 'mainnet'
}
