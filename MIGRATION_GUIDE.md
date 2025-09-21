# NEAR SDK v6.3.0 Migration Guide

This document outlines the breaking changes and migration steps for updating from near-api-js v0.44.2 to v6.3.0.

## Overview

The migration to NEAR SDK v6.3.0 introduces significant architectural changes that improve modularity, performance, and maintainability. This guide covers the key changes developers need to know.

## Key Breaking Changes

### 1. Modular Package Structure

**Before (v0.44.2):**
```typescript
import * as nearAPI from 'near-api-js'
import { keyStores } from 'near-api-js'
```

**After (v6.3.0):**
```typescript
import { InMemoryKeyStore } from '@near-js/keystores'
import { JsonRpcProvider } from '@near-js/providers'
import { Account, Contract } from '@near-js/accounts'
import { KeyPairSigner } from '@near-js/signers'
import { KeyPairString } from '@near-js/crypto'
```

### 2. Account Creation Pattern

**Before:**
```typescript
const connection = await nearAPI.connect(config)
const account = await connection.account(accountId)
```

**After:**
```typescript
const provider = new JsonRpcProvider({ url: rpcEndpoint })
const signer = KeyPairSigner.fromSecretKey(secretKey)
const account = new Account(accountId, provider, signer)
```

### 3. Transaction Signing

**Before:**
```typescript
// Used nearAPI.connect() and account.signAndSendTransaction()
```

**After:**
```typescript
// Direct account creation with signer
export function createAccountWithSigner(accountId: string, key?: string) {
  if (key) {
    const signer = createSignerFromKey(key)
    return createAccount(accountId, signer)
  }
  return createAccount(accountId)
}
```

### 4. Seed Phrase Handling

**Before:**
```typescript
// Custom seed phrase to key conversion
```

**After:**
```typescript
import { parseSeedPhrase } from 'near-seed-phrase'

export function createSignerFromKey(key: string) {
  if (key.split(' ').length > 1) {
    // Seed Phrase
    const { secretKey } = parseSeedPhrase(key)
    return KeyPairSigner.fromSecretKey(secretKey)
  } else {
    // Private Key
    return KeyPairSigner.fromSecretKey(key as KeyPairString)
  }
}
```

### 5. RPC Endpoints

**Before:**
```typescript
// Used near.org endpoints
const MAINNET_RPC_ENDPOINTS = ['https://rpc.mainnet.near.org']
```

**After:**
```typescript
// Updated to FastNEAR (near.org deprecated June 2025)
const MAINNET_RPC_ENDPOINTS = [
  'https://rpc.fastnear.com',
  'https://1rpc.io/near'
]
```

### 6. BigNumber Types

**Before:**
```typescript
// Used BN for gas and deposits
new BN(gas)
```

**After:**
```typescript
// Use BigInt for gas and deposits in v6.x
BigInt(gas)
BigInt(deposit)
```

### 7. Transaction Creation

**Before:**
```typescript
// Individual action imports
```

**After:**
```typescript
import { actionCreators } from '@near-js/transactions'

// Usage
actionCreators.functionCall(
  methodName,
  Buffer.from(args, 'base64'),
  BigInt(gas),
  BigInt(deposit)
)
```

## Browser Compatibility

### Webpack Configuration

Added comprehensive polyfills in `config-overrides.js`:

```javascript
const webpack = require('webpack')

const useFallback = () => (config) => {
  config.resolve.fallback = config.resolve.fallback ?? {}
  Object.assign(config.resolve.fallback, {
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    util: require.resolve('util'),
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    path: require.resolve('path-browserify'),
    fs: false,
    net: false,
    tls: false,
  })

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  )

  return config
}
```

## Ledger Integration

### Updated Signer Interface

```typescript
import { Signer } from '@near-js/signers'

export class LedgerSigner extends Signer {
  async signTransaction(transaction: any): Promise<any> {
    // Implementation for transaction signing
  }

  async signDelegateAction(): Promise<any> {
    throw new Error('Delegate actions are not supported with Ledger signer')
  }

  async signNep413Message(): Promise<any> {
    throw new Error('NEP-413 messages are not supported with Ledger signer')
  }
}
```

## Dependencies Added

The following new modular packages were added:

```json
{
  "@near-js/accounts": "^2.3.1",
  "@near-js/crypto": "^2.3.1",
  "@near-js/keystores": "^2.3.1",
  "@near-js/providers": "^2.3.1",
  "@near-js/signers": "^2.3.1",
  "@near-js/transactions": "^2.3.1",
  "@near-js/types": "^2.3.1",
  "@near-js/utils": "^2.3.1"
}
```

## Testing Checklist

After migration, verify these critical flows:

- [ ] Wallet connection with seed phrase
- [ ] Wallet connection with Ledger hardware wallet
- [ ] Multisig proposal creation
- [ ] Multisig proposal confirmation/rejection
- [ ] Transaction signing and sending
- [ ] Balance retrieval and display
- [ ] Fungible token operations
- [ ] Contract interactions
- [ ] Error handling scenarios

## Performance Impact

- **Bundle Size**: Maintained at ~478.99 kB gzipped
- **Load Time**: No significant regression
- **Runtime Performance**: Improved with modular architecture

## Troubleshooting

### Common Issues

1. **"not a constructor" errors**: Usually resolved by webpack polyfills
2. **Missing exports**: Check import paths for modular packages
3. **Type errors**: Ensure BigInt usage for gas/deposits in v6.x
4. **RPC errors**: Verify FastNEAR endpoints are being used

### Debug Steps

1. Clear node_modules and package-lock.json
2. Reinstall dependencies
3. Verify webpack configuration
4. Check browser console for specific error messages

## Resources

- [NEAR API JS Migration Guide](https://github.com/near/near-api-js/blob/main/MIGRATION.md)
- [NEAR JS Examples](https://github.com/near-examples/near-api-examples)
- [FastNEAR RPC Documentation](https://docs.fastnear.com/)

## Support

For questions or issues related to this migration, consult:
1. NEAR Protocol documentation
2. near-api-js GitHub repository
3. NEAR Discord development channels