import { RootState } from '../index'

import contractsSlice from './reducer'

export const getContractsSlice = (state: RootState) => state[contractsSlice.name]

export const getContracts = (state: RootState) => getContractsSlice(state).contracts

export const getLedger = (state: RootState) => getContractsSlice(state).ledger ?? {}

export const getLedgerPath = (state: RootState, contract_id: string) => getLedger(state)[contract_id] ?? 1
