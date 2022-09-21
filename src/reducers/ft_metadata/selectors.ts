import { RootState } from '../index'

import ftMetadataSlice from './reducer'

export const getFTMetadataSlice = (state: RootState) => state[ftMetadataSlice.name]

export const getFTMetadata = (state: RootState, tokenId?: string) =>
  tokenId ? getFTMetadataSlice(state).metadata[tokenId] : undefined

export const isFTMetadataLoading = (state: RootState, tokenId: string) => {
  const meta = getFTMetadata(state, tokenId)
  if (meta && 'loading' in meta) {
    return meta.loading
  }
  return false
}

export const hasFTMetadata = (state: RootState, tokenId: string) => {
  const meta = getFTMetadata(state, tokenId)
  if (meta && !('loading' in meta)) {
    return true
  }
  return false
}
