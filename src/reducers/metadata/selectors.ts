import { RootState } from '../index'

import metadataSlice from './reducer'

export const getMetadataSlice = (state: RootState) => state[metadataSlice.name]

export const getMetadata = (state: RootState, contractId: string) => getMetadataSlice(state).metadata[contractId]

export const getRequestIds = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  return metadata?.request_ids
}

export const getNumConfirmations = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  return metadata?.num_confirmations
}

export const getBalance = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  return metadata?.balance
}

export const getFailed = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  return metadata?.failed || !metadata?.request_ids
}

export const getInvalidated = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  return metadata?.invalidated ?? false
}
