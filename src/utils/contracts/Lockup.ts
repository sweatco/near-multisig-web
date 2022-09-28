import { Account, Contract } from 'near-api-js'

export interface LockupSchedule {
  timestamp: number
  balance: string
}

export interface Lockup {
  account_id: string
  schedule: LockupSchedule[]
  claimed_balance: string
  termination_config: unknown
  total_balance: string
  unclaimed_balance: string
  timestamp: number
}

export type LockupEntry = [number, Lockup]
export type ClaimEntry = [number, string]

export interface LockupContract extends Contract {
  get_account_lockups(options: { account_id: string }): Promise<LockupEntry[]>
  claim(options: { amounts?: ClaimEntry[] }, gas?: string): Promise<void>
}

const CONTRACT_METHODS = {
  viewMethods: ['get_account_lockups'],
  changeMethods: ['claim'], // change methods modify state
}

export const getContract = (account: Account, contractId: string) => {
  return new Contract(account, contractId, CONTRACT_METHODS) as LockupContract
}
