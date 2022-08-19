import { RootState } from '../index'

import metadataSlice from './reducer'

export const getMetadataSlice = (state: RootState) => state[metadataSlice.name]

export const getMetadata = (state: RootState, contractId: string) => getMetadataSlice(state).metadata[contractId]

export const getRequestIds = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  if (metadata && 'request_ids' in metadata) {
    return metadata.request_ids
  }
}

export const getNumConfirmations = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  if (metadata && 'num_confirmations' in metadata) {
    return metadata.num_confirmations
  }
}

export const getBalance = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  if (metadata && 'balance' in metadata) {
    return metadata.balance
  }
}

export const getFailed = (state: RootState, contractId: string) => {
  const metadata = getMetadata(state, contractId)
  return metadata && 'failed' in metadata
}
