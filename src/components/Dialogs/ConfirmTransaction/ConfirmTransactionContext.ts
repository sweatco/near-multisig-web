import React from 'react'
import LedgerManager from '../../../utils/LedgerManager'

export interface ConfirmTransactionOptions {
  title?: string
  contractId?: string
  onConfirmWithKey(key: string): Promise<boolean>
  onConfirmWithLedger(ledgerManager: LedgerManager, ledgerPath: number): Promise<boolean>
}

export type ConfirmTransactionFn = (options: ConfirmTransactionOptions) => Promise<any>

const ConfirmTransactionContext: React.Context<ConfirmTransactionFn> = React.createContext(async function (_) {})

export default ConfirmTransactionContext
