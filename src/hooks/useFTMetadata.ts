import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from './useApp'
import { ftMetadataSelectors } from '../reducers/ft_metadata'
import fetchFTMetadata from '../actions/chain/fetchFTMetadata'

const useFTMetadata = (tokenId: string) => {
  const dispatch = useAppDispatch()
  const metadata = useAppSelector((state) => ftMetadataSelectors.getFTMetadata(state, tokenId))

  useEffect(() => {
    dispatch(fetchFTMetadata(tokenId))
  }, [dispatch, tokenId])

  if (metadata && !('loading' in metadata)) {
    return metadata
  } else {
    return
  }
}

export default useFTMetadata
