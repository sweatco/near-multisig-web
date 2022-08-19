import { RootState } from '../index'

import contractsSlice from './reducer'

export const getContractsSlice = (state: RootState) => state[contractsSlice.name]

export const getContracts = (state: RootState) => getContractsSlice(state).contracts
