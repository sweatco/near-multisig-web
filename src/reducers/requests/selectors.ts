import { RootState } from '../index'

import requestsSlice from './reducer'

export const getRequestsSlice = (state: RootState) => state[requestsSlice.name]

export const getRequest = (state: RootState, contractId: string, requestId: number) =>
  getRequestsSlice(state).requests[contractId]?.[requestId]

export const getConfirmations = (state: RootState, contractId: string, requestId: number) =>
  getRequestsSlice(state).confirmations[contractId]?.[requestId]
