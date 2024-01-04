import { useEffect, useState } from 'react'

import { useAppDispatch } from './useApp'
import fetchFTStorageBalance from '../actions/chain/fetchFTStorageBalance'

const useFTStorage = (tokenId: string, accountId: string) => {
  const dispatch = useAppDispatch()
  const [storage, setStorage] = useState<boolean | undefined>()

  useEffect(() => {
    async function fetchResult() {
      if (tokenId && accountId) {
        const result = await dispatch(fetchFTStorageBalance({ tokenId, accountId })).unwrap()
        setStorage(result)
      }
    }

    fetchResult()
  }, [dispatch, tokenId, accountId])

  return storage
}

export default useFTStorage
