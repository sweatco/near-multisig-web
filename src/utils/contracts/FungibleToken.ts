import { Account, Contract } from 'near-api-js'

export interface FungibleTokenMetadata {
  spec: string
  name: string
  symbol: string
  icon?: string
  reference?: string
  reference_hash: any // ?? Option<Base64VecU8>
  decimals: number
}

export interface StorageBalance {
  total: string
  available: string
}

export interface FungibleTokenContract extends Contract {
  storage_balance_of(options: { account_id: string }): Promise<StorageBalance | null>
  ft_metadata(): Promise<FungibleTokenMetadata>
  ft_total_supply(): Promise<string>
  ft_balance_of(options: { account_id: string }): Promise<string>
  ft_transfer(
    options: { receiver_id: string; amount: string; memo?: string },
    gas: string,
    deposit: string
  ): Promise<void>
}

const CONTRACT_METHODS = {
  viewMethods: ['ft_balance_of', 'ft_total_supply', 'ft_metadata', 'storage_balance_of'],
  changeMethods: ['ft_transfer'],
}

export const getContract = (account: Account, contractId: string) => {
  return new Contract(account, contractId, CONTRACT_METHODS) as FungibleTokenContract
}
