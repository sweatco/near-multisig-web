import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountBalance } from 'near-api-js/lib/account'
import confirmRequest from '../../actions/chain/confirmRequest'
import deleteRequest from '../../actions/chain/deleteRequest'
import fetchContract from '../../actions/chain/fetchContract'

interface InvalidatedMetadata {
  invalidated?: boolean
}

export interface Metadata extends InvalidatedMetadata {
  num_confirmations: number
  balance: AccountBalance
  request_ids: number[]
}

export interface MetadataFailed extends InvalidatedMetadata {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchContract.fulfilled, (state, action) => {
        state.metadata[action.meta.arg] = action.payload
      })
      .addCase(fetchContract.rejected, (state, action) => {
        state.metadata[action.meta.arg] = { failed: true }
      })
      .addCase(confirmRequest.fulfilled, (state, action) => {
        const { contractId } = action.meta.arg
        state.metadata[contractId].invalidated = true
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        const { contractId } = action.meta.arg
        state.metadata[contractId].invalidated = true
      })
  },
})

export const metadataActions = metadataSlice.actions
export default metadataSlice
