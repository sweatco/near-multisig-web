import { createAsyncThunk } from '@reduxjs/toolkit'
import * as nearAPI from 'near-api-js'

import { DefaultNet } from '../../utils/networks'
import { getContract, FungibleTokenMetadata } from '../../utils/contracts/FungibleToken'
import { RootState } from '../../reducers'
import { ftMetadataSelectors } from '../../reducers/ft_metadata'
import { ErrorObject, errorToJson } from '../../utils/chainHelpers'

const fetchFTMetadata = createAsyncThunk<
  FungibleTokenMetadata,
  string,
  {
    state: RootState
    rejectValue: ErrorObject
  }
>(
  'chain/fetchFTMetadata',
  async (tokenId, { rejectWithValue }) => {
    const near = await nearAPI.connect(DefaultNet)
    const account = await near.account(tokenId)
    const contract = getContract(account, tokenId)

    try {
      return await contract.ft_metadata()
    } catch (err) {
      return rejectWithValue(errorToJson(err))
    }
  },
  {
    condition: (tokenId, { getState }) => {
      const state = getState()
      const isLoading = ftMetadataSelectors.isFTMetadataLoading(state, tokenId)
      const hasMetadata = ftMetadataSelectors.hasFTMetadata(state, tokenId)
      if (isLoading || hasMetadata) {
        return false
      }
    },
  }
)

export default fetchFTMetadata
