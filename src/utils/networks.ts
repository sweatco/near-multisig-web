import { InMemoryKeyStore } from '@near-js/keystores'
import { JsonRpcProvider } from '@near-js/providers'
import { Account } from '@near-js/accounts'

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface NetworkConfig {
  networkId: string
  explorerUrl: string
}

// =============================================================================
// RPC ENDPOINTS CONFIGURATION
// =============================================================================

// IMPORTANT: near.org endpoints are being deprecated starting June 1st, 2025
// Rate limits will be progressively reduced in three phases
// FastNEAR is recommended by NEAR Protocol as a reliable alternative

const MAINNET_RPC_ENDPOINTS = [
  'https://rpc.fastnear.com',           // FastNEAR - fastest and recommended
  'https://rpc.mainnet.near.org',       // Official (being deprecated June 2025)
  'https://near-mainnet.api.pagoda.co', // Pagoda backup
]

const TESTNET_RPC_ENDPOINTS = [
  'https://test.rpc.fastnear.com',      // FastNEAR - fastest and recommended
  'https://rpc.testnet.near.org',       // Official (being deprecated June 2025)
]

// =============================================================================
// NETWORK CONFIGURATIONS (v6.x Simplified)
// =============================================================================

export const MainNet: NetworkConfig = {
  networkId: 'mainnet',
  explorerUrl: 'https://explorer.mainnet.near.org',
}

export const TestNet: NetworkConfig = {
  networkId: 'testnet',
  explorerUrl: 'https://explorer.testnet.near.org',
}

export const DefaultNet = process.env.NODE_ENV === 'production' ? MainNet : TestNet

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const isMainNet = (): boolean => {
  return DefaultNet.networkId === 'mainnet'
}


// =============================================================================
// ACCOUNT CREATION (v6.x)
// =============================================================================

export function createAccount(accountId: string, signer?: any, keyStore?: any) {
  // Create provider using static imports - following cookbook pattern
  const endpoints = DefaultNet.networkId === 'mainnet' ? MAINNET_RPC_ENDPOINTS : TESTNET_RPC_ENDPOINTS

  try {
    const provider = new JsonRpcProvider({ url: endpoints[0] })

    // Account constructor in v6.x: new Account(accountId, provider, signer)
    if (signer) {
      return new Account(accountId, provider, signer)
    } else if (keyStore) {
      // For keyStore, we need to create a signer from it
      return new Account(accountId, provider, keyStore)
    } else {
      // View-only account (no signer)
      return new Account(accountId, provider)
    }
  } catch (error: any) {
    console.error('Failed to create NEAR account:', error)
    throw new Error(`Failed to create NEAR account: ${error?.message || error}`)
  }
}

// Helper to create keyStore when needed (for backward compatibility)
export function createKeyStore() {
  return new InMemoryKeyStore()
}