import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountBalance } from 'near-api-js/lib/account'

export interface Metadata {
  num_confirmations: number
  balance: AccountBalance
  request_ids: number[]
}

export interface MetadataFailed {
  failed: true
}

interface MetadataState {
  metadata: {
    [contractId: string]: Metadata | MetadataFailed
  }
}

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: { metadata: {} } as MetadataState,
  reducers: {
    setMetadata(state, action: PayloadAction<{ contractId: string; metadata: Metadata | MetadataFailed }>) {
      state.metadata[action.payload.contractId] = action.payload.metadata
    },
  },
})

export const metadataActions = metadataSlice.actions
export default metadataSlice
