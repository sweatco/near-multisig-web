import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountBalance } from '@near-js/accounts'
import addRequest from '../../actions/chain/addRequest'
import confirmRequest from '../../actions/chain/confirmRequest'
import deleteRequest from '../../actions/chain/deleteRequest'
import fetchContract from '../../actions/chain/fetchContract'
import fetchContractRequestList from '../../actions/chain/fetchContractRequestList'

interface InvalidatedMetadata {
  invalidated?: boolean
}

export interface Metadata extends InvalidatedMetadata {
  balance?: AccountBalance
  num_confirmations?: number
  request_ids?: number[]
  failed?: boolean
}

interface MetadataState {
  metadata: {
    [contractId: string]: Metadata
  }
}

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: { metadata: {} } as MetadataState,
  reducers: {
    setMetadata(state, action: PayloadAction<{ contractId: string; metadata: Metadata }>) {
      state.metadata[action.payload.contractId] = action.payload.metadata
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContract.fulfilled, (state, action) => {
        state.metadata[action.meta.arg] ||= {}
        state.metadata[action.meta.arg].balance = action.payload.balance
        state.metadata[action.meta.arg].num_confirmations = action.payload.num_confirmations
      })
      .addCase(fetchContractRequestList.fulfilled, (state, action) => {
        state.metadata[action.meta.arg] ||= {}
        state.metadata[action.meta.arg].request_ids = action.payload
        state.metadata[action.meta.arg].failed = false
      })
      .addCase(fetchContractRequestList.rejected, (state, action) => {
        state.metadata[action.meta.arg] ||= {}
        state.metadata[action.meta.arg].failed = true
      })
      .addCase(confirmRequest.fulfilled, (state, action) => {
        const { contractId } = action.meta.arg
        state.metadata[contractId].invalidated = true
      })
      .addCase(addRequest.fulfilled, (state, action) => {
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
