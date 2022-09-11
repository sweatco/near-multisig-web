import { createSlice } from '@reduxjs/toolkit'
import { AccountBalance } from 'near-api-js/lib/account'
import fetchFTMetadata from '../../actions/chain/fetchFTMetadata'
import { FungibleTokenMetadata } from '../../utils/contracts/FungibleToken'

interface InvalidatedMetadata {
  invalidated?: boolean
}

export interface Metadata extends InvalidatedMetadata {
  num_confirmations: number
  balance: AccountBalance
  request_ids: number[]
}

export interface FTRequestState {
  loading: boolean
}

interface FTMetadataState {
  metadata: {
    [tokenId: string]: FungibleTokenMetadata | FTRequestState
  }
}

export const ftMetadataSlice = createSlice({
  name: 'ft_metadata',
  initialState: { metadata: {} } as FTMetadataState,
  reducers: {
    // setMetadata(state, action: PayloadAction<{ contractId: string; metadata: Metadata | MetadataFailed }>) {
    //   state.metadata[action.payload.contractId] = action.payload.metadata
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFTMetadata.pending, (state, action) => {
        state.metadata[action.meta.arg] = { loading: true }
      })
      .addCase(fetchFTMetadata.fulfilled, (state, action) => {
        state.metadata[action.meta.arg] = action.payload
      })
      .addCase(fetchFTMetadata.rejected, (state, action) => {
        state.metadata[action.meta.arg] = { loading: false }
      })
  },
})

export const ftMetadataActions = ftMetadataSlice.actions
export default ftMetadataSlice
