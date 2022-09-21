import { createSlice } from '@reduxjs/toolkit'
import fetchFTMetadata from '../../actions/chain/fetchFTMetadata'
import { FungibleTokenMetadata } from '../../utils/contracts/FungibleToken'

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
  reducers: {},
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
